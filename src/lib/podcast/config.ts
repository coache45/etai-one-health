/**
 * The O-Spot — Podcast Configuration
 * Single source of truth for all podcast metadata and external links.
 * Update this file when URLs change; nothing else should hardcode these.
 */

export const PODCAST_CONFIG = {
  // Identity
  showName: "The O-Spot",
  tagline: "AI, life, and love — brought down to earth.",
  hosts: "Ernest & Tanja Owens",
  location: "Charlotte, NC",
  contactEmail: "the.o.spot@etaiworld.ai",

  // Listen / watch URLs
  spotifyShowUrl: "https://open.spotify.com/show/2P0DVti3N9zzZve7uVPvCc",
  youtubeChannelUrl: "", // TODO: fill after brand channel + @TheOSpot handle claim
  applePodcastsUrl: "", // TODO: fill after Apple submission (post-Ep1)

  // RSS — Spotify gates this until Ep1 is published
  rssFeedUrl: "", // TODO: fill from Spotify creators dashboard after Ep1 goes live

  // Social
  instagramUrl: "https://instagram.com/the.o.spot",
  instagramHandle: "@the.o.spot",
  youtubeHandle: "@TheOSpot",

  // MailerLite embedded form
  // Get from: MailerLite → Forms → Embedded forms → "The O-Spot Listeners" → Action URL
  mailerLiteFormAction: "", // TODO
  mailerLiteAccountId: "",  // TODO
  mailerLiteFormId: "",     // TODO

  // Release cadence
  releaseDay: "Tuesday",
  releaseTime: "7:00 AM ET",

  // Static fallback while RSS is gated
  fallbackEpisode: {
    title: "Episode 1 — Bringing AI Down to Earth: How We Got Here",
    description:
      "Origin story, ELI5, We Tried It, and Couple in AI. Our first conversation, in four parts.",
    releaseDate: "2026-04-14T11:00:00Z", // Tue Apr 14, 2026, 7:00 AM ET
    runtime: "~50 min",
    isComingSoon: true,
  },
} as const;

export type PodcastConfig = typeof PODCAST_CONFIG;
