import { skills, story, timeline } from "@/data/portfolio";
import Reveal from "@/components/ui/reveal";

const gridStyle: React.CSSProperties = {
  backgroundImage:
    "linear-gradient(rgba(163,177,194,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(163,177,194,0.04) 1px, transparent 1px)",
  backgroundSize: "72px 72px",
};

export default function About() {
  return (
    <section
      id="about"
      className="relative overflow-hidden border-t border-white/[0.06] py-[var(--section-y)]"
      style={gridStyle}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_0%,rgba(216,235,243,0.05),transparent_70%)]"
      />

      <div className="relative mx-auto w-full max-w-6xl px-[var(--gutter)]">
        {/* header */}
        <div className="mb-16 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <Reveal>
            <h2 className="mt-4 max-w-md text-h2 font-medium uppercase text-pearl">
              Dari Piksel ke Kode
            </h2>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="max-w-sm font-mono text-xs leading-relaxed tracking-wider text-pearl/50">
              DESAIN <span className="text-cool-blue">+</span> REKAYASA
              <br />
              SATU MONUMEN DIGITAL.
            </p>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 gap-16 lg:grid-cols-[1.1fr_0.9fr]">
          {/* story */}
          <Reveal className="self-center">
            <p className="max-w-xl text-body leading-relaxed text-pearl/80">{story}</p>
          </Reveal>

          {/* timeline — architectural blueprint */}
          <div className="relative">
            <Reveal>
              <p className="overline mb-8">LINIMASA</p>
            </Reveal>
            <div className="relative ml-2 border-l border-cool-blue/20">
              {timeline.map((item, i) => (
                <Reveal key={item.year} delay={i * 0.08} className="relative pl-10 pb-10 last:pb-0">
                  {/* node */}
                  <span className="absolute -left-[5px] top-1 h-2.5 w-2.5 rotate-45 border border-cool-blue bg-black" />
                  <span className="absolute -left-[5px] top-1 h-2.5 w-2.5 rotate-45 bg-cool-blue/30 blur-[3px]" />
                  <p className="font-mono text-sm text-cool-blue">{item.year}</p>
                  <h3 className="mt-1 text-h4 font-medium text-pearl">{item.title}</h3>
                  <p className="mt-2 max-w-sm text-sm leading-relaxed text-pearl/60">
                    {item.description}
                  </p>
                </Reveal>
              ))}
            </div>
          </div>
        </div>

        {/* skills strip */}
        <div className="mt-24">
          <Reveal>
            <p className="overline mb-8">INDEKS KEAHLIAN</p>
          </Reveal>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {skills.map((group, gi) => (
              <Reveal key={group.category} delay={gi * 0.08}>
                <div className="glass-panel p-6">
                  <p className="font-mono text-xs uppercase tracking-[0.25em] text-cool-blue">
                    {group.category}
                  </p>
                  <div className="mt-5 space-y-4">
                    {group.skills.map((skill) => (
                      <div key={skill.name}>
                        <div className="flex items-center justify-between gap-4">
                          <p className="text-sm text-pearl/80">{skill.name}</p>
                          <p className="font-mono text-xs text-pearl/40">{skill.level}</p>
                        </div>
                        <div className="mt-1.5 h-px w-full bg-white/10">
                          <div
                            className="h-px bg-gradient-to-r from-cool-blue via-chrome to-white"
                            style={{ width: `${skill.level}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
