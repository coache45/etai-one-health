/**
 * RSS feed fetcher for The O-Spot
 * Returns the latest episode from Spotify's auto-generated RSS feed.
 * Falls back gracefully when:
 *   - RSS URL is not yet configured (pre-Ep1 launch)
 *   - Network failure
 *   - Empty feed
 */

import { PODCAST_CONFIG } from "./config";

export type Episode = {
  title: string;
  description: string;
  releaseDate: string;
  runtime: string;
  audioUrl?: string;
  spotifyUrl?: string;
  isComingSoon: boolean;
};

/**
 * Server-side RSS fetch with ISR-friendly caching.
 * Used in Server Components only.
 */
export async function getLatestEpisode(): Promise<Episode> {
  const url = PODCAST_CONFIG.rssFeedUrl;

  // Pre-launch fallback: RSS not yet configured
  if (!url) {
    return {
      ...PODCAST_CONFIG.fallbackEpisode,
    };
  }

  try {
    const res = await fetch(url, {
      next: { revalidate: 3600 }, // 1 hour ISR
      headers: { "User-Agent": "the-o-spot/1.0 (+https://etaiworld.ai/podcast)" },
    });

    if (!res.ok) throw new Error(`RSS fetch failed: ${res.status}`);

    const xml = await res.text();
    const episode = parseLatestItem(xml);

    if (!episode) return { ...PODCAST_CONFIG.fallbackEpisode };
    return episode;
  } catch (err) {
    // Silent fallback — never break the page
    console.warn("[podcast/rss] fetch failed, using fallback:", err);
    return { ...PODCAST_CONFIG.fallbackEpisode };
  }
}

/**
 * Minimal RSS parser — extracts the first <item> from a podcast feed.
 * No external dependencies; handles the standard RSS 2.0 + iTunes namespace shape.
 */
function parseLatestItem(xml: string): Episode | null {
  const itemMatch = xml.match(/<item\b[^>]*>([\s\S]*?)<\/item>/);
  if (!itemMatch) return null;

  const item = itemMatch[1];
  const pick = (tag: string) => {
    const m = item.match(
      new RegExp(`<${tag}\\b[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i")
    );
    if (!m) return "";
    return m[1]
      .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
      .replace(/<[^>]+>/g, "")
      .trim();
  };

  const title = pick("title");
  const description = pick("description") || pick("itunes:summary");
  const pubDate = pick("pubDate");
  const duration = pick("itunes:duration");
  const enclosureMatch = item.match(/<enclosure\b[^>]*url="([^"]+)"/);
  const linkMatch = pick("link");

  if (!title) return null;

  return {
    title,
    description: description.slice(0, 280),
    releaseDate: pubDate ? new Date(pubDate).toISOString() : new Date().toISOString(),
    runtime: duration || "—",
    audioUrl: enclosureMatch?.[1],
    spotifyUrl: linkMatch || PODCAST_CONFIG.spotifyShowUrl,
    isComingSoon: false,
  };
}
