import type { Episode } from "@/lib/podcast/rss";
import type { PodcastConfig } from "@/lib/podcast/config";

interface Props {
  episode: Episode;
  config: PodcastConfig;
}

export function EpisodeCard({ episode, config }: Props) {
  const date = new Date(episode.releaseDate).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <article className="rounded-2xl border border-[#C9A84C]/20 bg-[#0A1126]/50 p-8 backdrop-blur">
      {episode.isComingSoon && (
        <p className="mb-3 text-xs uppercase tracking-widest text-[#EBC869]">
          Coming {date}
        </p>
      )}
      <h3 className="mb-3 font-serif text-2xl text-[#ECE2C8] md:text-3xl">
        {episode.title}
      </h3>
      <p className="mb-6 text-[#ECE2C8]/70">{episode.description}</p>
      <div className="flex items-center gap-4 text-sm text-[#ECE2C8]/50">
        <span>{date}</span>
        <span aria-hidden>·</span>
        <span>{episode.runtime}</span>
      </div>
      <a
        href={episode.spotifyUrl || config.spotifyShowUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-6 inline-block rounded-full bg-[#C9A84C] px-6 py-2 text-sm font-medium text-[#101A38] transition hover:bg-[#EBC869]"
      >
        {episode.isComingSoon ? "Follow on Spotify" : "Play on Spotify"}
      </a>
    </article>
  );
}
