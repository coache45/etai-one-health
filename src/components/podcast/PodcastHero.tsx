import Image from "next/image";
import type { PodcastConfig } from "@/lib/podcast/config";

interface Props {
  config: PodcastConfig;
}

export function PodcastHero({ config }: Props) {
  return (
    <section className="relative overflow-hidden px-6 py-24 md:py-32">
      <div className="mx-auto flex max-w-5xl flex-col items-center text-center">
        <div className="relative mb-10 h-64 w-64 md:h-80 md:w-80">
          <Image
            src="/podcast/cover-1080.png"
            alt="The O-Spot cover art"
            fill
            priority
            sizes="(max-width: 768px) 256px, 320px"
            className="rounded-2xl shadow-2xl shadow-black/40"
          />
        </div>

        <h1 className="mb-4 font-serif text-5xl text-[#ECE2C8] md:text-7xl">
          {config.showName}
        </h1>
        <p className="mb-2 max-w-2xl font-serif italic text-xl text-[#EBC869] md:text-2xl">
          {config.tagline}
        </p>
        <p className="mb-10 text-sm uppercase tracking-widest text-[#ECE2C8]/60">
          New episodes {config.releaseDay}s · Hosted by {config.hosts}
        </p>

        <div className="flex flex-col gap-3 sm:flex-row">
          <a
            href={config.spotifyShowUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-[#C9A84C] px-8 py-3 font-medium text-[#101A38] transition hover:bg-[#EBC869]"
          >
            Listen on Spotify
          </a>
          {config.youtubeChannelUrl && (
            <a
              href={config.youtubeChannelUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-[#C9A84C] px-8 py-3 font-medium text-[#C9A84C] transition hover:bg-[#C9A84C] hover:text-[#101A38]"
            >
              Watch on YouTube
            </a>
          )}
          {config.applePodcastsUrl && (
            <a
              href={config.applePodcastsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-[#C9A84C] px-8 py-3 font-medium text-[#C9A84C] transition hover:bg-[#C9A84C] hover:text-[#101A38]"
            >
              Apple Podcasts
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
