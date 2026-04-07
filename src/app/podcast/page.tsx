/**
 * /podcast — The O-Spot landing page
 * Server Component. ISR via getLatestEpisode (revalidate: 3600).
 *
 * Goal: convert a visitor to a Spotify/YouTube/Apple listener in <10s.
 * Secondary: capture email via MailerLite.
 */

import type { Metadata } from "next";
import { PODCAST_CONFIG } from "@/lib/podcast/config";
import { getLatestEpisode } from "@/lib/podcast/rss";
import { PodcastHero } from "@/components/podcast/PodcastHero";
import { EpisodeCard } from "@/components/podcast/EpisodeCard";
import { SegmentGrid } from "@/components/podcast/SegmentGrid";
import { EmailCapture } from "@/components/podcast/EmailCapture";
import { Hosts } from "@/components/podcast/Hosts";

export const metadata: Metadata = {
  title: "The O-Spot — A Podcast by ET AI",
  description:
    "AI, life, and love — brought down to earth. Hosted by Ernest and Tanja Owens. New episodes every Tuesday.",
  openGraph: {
    title: "The O-Spot",
    description: "AI, life, and love — brought down to earth.",
    images: ["/podcast/cover-1080.png"],
    type: "website",
    siteName: "ET AI",
  },
  twitter: {
    card: "summary_large_image",
    title: "The O-Spot",
    description: "AI, life, and love — brought down to earth.",
    images: ["/podcast/cover-1080.png"],
  },
};

// ISR — revalidate every hour
export const revalidate = 3600;

export default async function PodcastPage() {
  const episode = await getLatestEpisode();

  return (
    <main className="min-h-screen bg-[#101A38] text-[#ECE2C8]">
      <PodcastHero config={PODCAST_CONFIG} />

      <section className="mx-auto max-w-5xl px-6 py-20">
        <h2 className="mb-8 font-serif text-3xl text-[#ECE2C8] md:text-4xl">
          Latest episode
        </h2>
        <EpisodeCard episode={episode} config={PODCAST_CONFIG} />
      </section>

      <section className="mx-auto max-w-5xl px-6 py-20">
        <h2 className="mb-8 font-serif text-3xl text-[#ECE2C8] md:text-4xl">
          What's in every episode
        </h2>
        <SegmentGrid />
      </section>

      <section className="mx-auto max-w-3xl px-6 py-20 text-center">
        <h2 className="mb-4 font-serif text-3xl text-[#ECE2C8] md:text-4xl">
          Get every episode in your inbox
        </h2>
        <p className="mb-8 text-[#ECE2C8]/70">
          New episodes every {PODCAST_CONFIG.releaseDay} morning. No spam, ever.
        </p>
        <EmailCapture config={PODCAST_CONFIG} />
      </section>

      <section className="mx-auto max-w-5xl px-6 py-20">
        <h2 className="mb-8 font-serif text-3xl text-[#ECE2C8] md:text-4xl">
          Your hosts
        </h2>
        <Hosts />
      </section>

      <footer className="border-t border-[#C9A84C]/20 px-6 py-10 text-center text-sm text-[#ECE2C8]/60">
        <p>© {new Date().getFullYear()} ET AI, LLC · Charlotte, NC</p>
        <p className="mt-2">
          <a
            href={`mailto:${PODCAST_CONFIG.contactEmail}`}
            className="text-[#C9A84C] hover:underline"
          >
            {PODCAST_CONFIG.contactEmail}
          </a>
          {" · "}
          <a
            href={PODCAST_CONFIG.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#C9A84C] hover:underline"
          >
            {PODCAST_CONFIG.instagramHandle}
          </a>
          {PODCAST_CONFIG.youtubeChannelUrl && (
            <>
              {" · "}
              <a
                href={PODCAST_CONFIG.youtubeChannelUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#C9A84C] hover:underline"
              >
                {PODCAST_CONFIG.youtubeHandle}
              </a>
            </>
          )}
        </p>
      </footer>
    </main>
  );
}
