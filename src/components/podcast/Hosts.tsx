/**
 * Hosts section — Ernest & Tanja Owens
 * Headshots are placeholders until you drop real ones into /public/podcast/hosts/
 */

const HOSTS = [
  {
    name: "Ernest Owens",
    role: "CEO, ET AI",
    bio: "Engineer turned founder. Builds AI systems for humans and machines. Father, husband, recovering perfectionist.",
    image: "/podcast/hosts/ernest.png",
  },
  {
    name: "Tanja Owens",
    role: "COO, ET AI",
    bio: "Educator turned operator. Runs brand, content, and the part of the company that has feelings. Mother, wife, fierce advocate.",
    image: "/podcast/hosts/tanja.png",
  },
] as const;

export function Hosts() {
  return (
    <div className="grid gap-8 md:grid-cols-2">
      {HOSTS.map((host) => (
        <div
          key={host.name}
          className="flex gap-6 rounded-xl border border-[#C9A84C]/20 bg-[#0A1126]/40 p-6"
        >
          <div
            className="h-24 w-24 flex-shrink-0 rounded-full bg-[#C9A84C]/20"
            aria-label={`${host.name} portrait placeholder`}
          />
          <div>
            <h3 className="font-serif text-xl text-[#ECE2C8]">{host.name}</h3>
            <p className="mb-2 text-xs uppercase tracking-widest text-[#C9A84C]">
              {host.role}
            </p>
            <p className="text-sm text-[#ECE2C8]/70">{host.bio}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
