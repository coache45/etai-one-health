// MCP Federation Client — for agents in etai-one-health (or any product repo)
//
// Usage:
//   import { mcpCall, mcpCallSafe } from "@/lib/mcp/client";
//
//   // Fire-and-forget pattern (throws on failure):
//   const result = await mcpCall("supabase_query", { query: "SELECT ..." });
//
//   // Safe pattern (returns { ok, data, error }):
//   const result = await mcpCallSafe("send_email", { to: "...", subject: "..." });
//
// All calls route through the Aethelgard Core federation gateway at:
//   POST https://aethelgard-core.vercel.app/api/mcp/call/{tool_name}
//
// Every call is:
//   1. Authenticated (bearer token)
//   2. Policy-checked (Aethelgard default-deny)
//   3. Audit-logged (hash-chained, tamper-evident)
//
// This client handles retries, timeouts, and structured error reporting.

// ------------------------------------------------------------------
// Configuration
// ------------------------------------------------------------------

const MCP_GATEWAY_URL =
  process.env.AETHELGARD_GATEWAY_URL ||
  "https://aethelgard-core.vercel.app/api/mcp/call";

const MCP_AUTH_TOKEN = process.env.AETHELGARD_INTERNAL_TOKEN || "";

const DEFAULT_PRODUCT_ID = process.env.NEXT_PUBLIC_PRODUCT_ID || "one-health";

const DEFAULT_TIMEOUT_MS = 10_000; // 10 seconds
const MAX_RETRIES = 2;
const RETRY_DELAY_MS = 500;

// ------------------------------------------------------------------
// Types
// ------------------------------------------------------------------

export interface McpCallOptions {
  /** Product ID (defaults to NEXT_PUBLIC_PRODUCT_ID env var) */
  product_id?: string;
  /** Agent identifier for audit trail */
  agent_id?: string;
  /** Additional context for policy evaluation */
  context?: Record<string, unknown>;
  /** Timeout in ms (default 10_000) */
  timeout_ms?: number;
  /** Number of retries on 5xx (default 2) */
  retries?: number;
  /** Skip retries entirely */
  no_retry?: boolean;
}

export interface McpCallSuccess<T = unknown> {
  ok: true;
  data: T;
  audit_id?: string;
  latency_ms: number;
  mock_mode?: boolean;
}

export interface McpCallError {
  ok: false;
  error: string;
  status_code?: number;
  reasons?: string[];
  audit_id?: string;
}

export type McpCallResult<T = unknown> = McpCallSuccess<T> | McpCallError;

// ------------------------------------------------------------------
// Core client
// ------------------------------------------------------------------

/**
 * Call an MCP tool through the federation gateway.
 * Throws on failure. Use mcpCallSafe() for Result-pattern.
 */
export async function mcpCall<T = unknown>(
  toolName: string,
  inputs: unknown,
  options: McpCallOptions = {}
): Promise<T> {
  const result = await mcpCallSafe<T>(toolName, inputs, options);
  if (!result.ok) {
    throw new McpFederationError(
      result.error,
      result.status_code,
      result.reasons,
      result.audit_id
    );
  }
  return result.data;
}

/**
 * Call an MCP tool through the federation gateway.
 * Returns { ok, data, error } — never throws.
 */
export async function mcpCallSafe<T = unknown>(
  toolName: string,
  inputs: unknown,
  options: McpCallOptions = {}
): Promise<McpCallResult<T>> {
  const {
    product_id = DEFAULT_PRODUCT_ID,
    agent_id = `${product_id}::agent`,
    context = {},
    timeout_ms = DEFAULT_TIMEOUT_MS,
    retries = MAX_RETRIES,
    no_retry = false
  } = options;

  if (!MCP_AUTH_TOKEN) {
    return {
      ok: false,
      error: "AETHELGARD_INTERNAL_TOKEN not set. Cannot call federation gateway.",
      status_code: 0
    };
  }

  const url = `${MCP_GATEWAY_URL}/${toolName}`;
  const body = JSON.stringify({
    agent_id,
    product_id,
    inputs,
    context
  });

  const maxAttempts = no_retry ? 1 : retries + 1;
  let lastError: McpCallError | null = null;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), timeout_ms);

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${MCP_AUTH_TOKEN}`
        },
        body,
        signal: controller.signal
      });

      clearTimeout(timer);

      const data = await response.json();

      // Success
      if (response.ok && data.allowed) {
        return {
          ok: true,
          data: data.result as T,
          audit_id: data.audit_id,
          latency_ms: data.latency_ms || 0,
          mock_mode: data.result?.mock || data.result?.mock_mode
        };
      }

      // Policy denial (403) — do NOT retry
      if (response.status === 403) {
        return {
          ok: false,
          error: "policy_denied",
          status_code: 403,
          reasons: data.reasons || [],
          audit_id: data.audit_id
        };
      }

      // Client error (4xx) — do NOT retry
      if (response.status >= 400 && response.status < 500) {
        return {
          ok: false,
          error: data.error || `http_${response.status}`,
          status_code: response.status,
          reasons: data.errors || data.reasons
        };
      }

      // Server error (5xx) — retry if attempts remain
      lastError = {
        ok: false,
        error: data.error || `http_${response.status}`,
        status_code: response.status,
        reasons: data.reasons,
        audit_id: data.audit_id
      };
    } catch (e) {
      const errorMsg =
        e instanceof Error
          ? e.name === "AbortError"
            ? `timeout after ${timeout_ms}ms`
            : e.message
          : String(e);

      lastError = {
        ok: false,
        error: `network_error: ${errorMsg}`,
        status_code: 0
      };
    }

    // Wait before retry (exponential backoff)
    if (attempt < maxAttempts) {
      await new Promise((resolve) =>
        setTimeout(resolve, RETRY_DELAY_MS * attempt)
      );
    }
  }

  return lastError!;
}

// ------------------------------------------------------------------
// Convenience wrappers for common ONE Health agent patterns
// ------------------------------------------------------------------

/**
 * Query Supabase through the federation gateway (read-only).
 * Policy: allowed for one-health product, system agent type.
 */
export async function federatedQuery<T = unknown>(
  query: string,
  options: McpCallOptions = {}
): Promise<McpCallResult<T>> {
  return mcpCallSafe<T>("supabase_query", { query }, {
    ...options,
    agent_id: options.agent_id || `${DEFAULT_PRODUCT_ID}::system`
  });
}

/**
 * Send an email through the federation gateway.
 * Policy: allowed for one-health, high-risk (requires explicit policy rule).
 */
export async function federatedEmail(
  to: string,
  subject: string,
  body: string,
  options: McpCallOptions = {}
): Promise<McpCallResult> {
  return mcpCallSafe("send_email", { to, subject, body }, options);
}

/**
 * Search the web through the federation gateway.
 * Policy: allowed for one-health, low-risk.
 */
export async function federatedSearch<T = unknown>(
  query: string,
  options: McpCallOptions = {}
): Promise<McpCallResult<T>> {
  return mcpCallSafe<T>("web_search", { query }, options);
}

/**
 * Get calendar events through the federation gateway.
 * Policy: allowed for one-health, medium-risk.
 */
export async function federatedCalendar<T = unknown>(
  days: number = 7,
  options: McpCallOptions = {}
): Promise<McpCallResult<T>> {
  return mcpCallSafe<T>("get_calendar", { days }, options);
}

// ------------------------------------------------------------------
// Error class
// ------------------------------------------------------------------

export class McpFederationError extends Error {
  status_code?: number;
  reasons?: string[];
  audit_id?: string;

  constructor(
    message: string,
    statusCode?: number,
    reasons?: string[],
    auditId?: string
  ) {
    super(message);
    this.name = "McpFederationError";
    this.status_code = statusCode;
    this.reasons = reasons;
    this.audit_id = auditId;
  }
}
