// MCP Federation Client — Smoke Tests
//
// Run with: npx jest src/lib/mcp/client.test.ts
// Or: npx tsx --test src/lib/mcp/client.test.ts
//
// These tests verify the client handles all response scenarios correctly.
// They mock fetch() — no real network calls.

import { mcpCall, mcpCallSafe, McpFederationError } from "./client";

// Mock fetch globally
const mockFetch = jest.fn();
global.fetch = mockFetch;

// Set required env vars
process.env.AETHELGARD_INTERNAL_TOKEN = "test-token-for-unit-tests";
process.env.AETHELGARD_GATEWAY_URL = "https://mock-gateway.test/api/mcp/call";
process.env.NEXT_PUBLIC_PRODUCT_ID = "one-health";

beforeEach(() => {
  mockFetch.mockReset();
});

describe("mcpCallSafe", () => {
  it("returns success on 200 with allowed=true", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({
        allowed: true,
        result: { rows: [{ id: 1 }] },
        audit_id: "audit-123",
        latency_ms: 42
      })
    });

    const result = await mcpCallSafe("supabase_query", { query: "SELECT 1" });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data).toEqual({ rows: [{ id: 1 }] });
      expect(result.audit_id).toBe("audit-123");
      expect(result.latency_ms).toBe(42);
    }
  });

  it("returns policy_denied on 403", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 403,
      json: async () => ({
        allowed: false,
        reasons: ["default_deny: no matching policy"],
        matched_policy: "default_deny",
        audit_id: "audit-456"
      })
    });

    const result = await mcpCallSafe("send_plc_command", { command: "START" });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toBe("policy_denied");
      expect(result.status_code).toBe(403);
      expect(result.reasons).toContain("default_deny: no matching policy");
    }
  });

  it("does not retry on 4xx errors", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: async () => ({
        error: "invalid_request",
        errors: ["missing product_id"]
      })
    });

    const result = await mcpCallSafe("web_search", { query: "test" });
    expect(result.ok).toBe(false);
    expect(mockFetch).toHaveBeenCalledTimes(1); // No retry
  });

  it("retries on 5xx errors up to max retries", async () => {
    mockFetch
      .mockResolvedValueOnce({
        ok: false,
        status: 502,
        json: async () => ({ error: "upstream_error" })
      })
      .mockResolvedValueOnce({
        ok: false,
        status: 502,
        json: async () => ({ error: "upstream_error" })
      })
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({
          allowed: true,
          result: { success: true },
          latency_ms: 10
        })
      });

    const result = await mcpCallSafe("web_search", { query: "retry test" });
    expect(result.ok).toBe(true);
    expect(mockFetch).toHaveBeenCalledTimes(3); // 1 initial + 2 retries
  });

  it("handles network errors gracefully", async () => {
    mockFetch.mockRejectedValue(new Error("ECONNREFUSED"));

    const result = await mcpCallSafe("web_search", { query: "test" }, {
      no_retry: true
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toContain("network_error");
      expect(result.status_code).toBe(0);
    }
  });

  it("returns error when token is missing", async () => {
    const savedToken = process.env.AETHELGARD_INTERNAL_TOKEN;
    process.env.AETHELGARD_INTERNAL_TOKEN = "";

    const result = await mcpCallSafe("web_search", { query: "test" });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toContain("AETHELGARD_INTERNAL_TOKEN not set");
    }

    process.env.AETHELGARD_INTERNAL_TOKEN = savedToken;
  });
});

describe("mcpCall (throwing variant)", () => {
  it("throws McpFederationError on failure", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 403,
      json: async () => ({
        allowed: false,
        reasons: ["policy_denied"],
        audit_id: "audit-789"
      })
    });

    await expect(
      mcpCall("send_email", { to: "test@test.com" })
    ).rejects.toThrow(McpFederationError);
  });

  it("returns data directly on success", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({
        allowed: true,
        result: { events: [] },
        latency_ms: 15
      })
    });

    const data = await mcpCall("get_calendar", { days: 7 });
    expect(data).toEqual({ events: [] });
  });
});
