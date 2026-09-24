import { projects } from "@/data/portfolio";
import Reveal from "@/components/ui/reveal";

export default function Projects() {
  return (
    <section
      id="projects"
      className="relative overflow-hidden border-t border-white/[0.06] py-[var(--section-y)]"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_40%_at_80%_20%,rgba(216,235,243,0.05),transparent_70%)]"
      />

      <div className="relative mx-auto w-full max-w-6xl px-[var(--gutter)]">
        {/* header */}
        <div className="mb-16 max-w-2xl">
          <Reveal>
            <h2 className="mt-4 text-h2 font-medium uppercase text-pearl">
              Dari Piksel ke Kode
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-6 leading-relaxed text-pearl/70">
              Saya merancang visual, membangun antarmuka, dan menciptakan pengalaman web yang interaktif.
              Perjalanan saya dimulai dari desain visual — membuat konten digital dan pengalaman brand.
              Seiring waktu, saya tertarik pada bagaimana desain bisa menjadi interaktif — kini saya
              memadukan kreativitas dan teknologi untuk membangun pengalaman web modern.
            </p>
          </Reveal>
        </div>

        {/* digital rooms */}
        <div className="space-y-8">
          {projects.map((project, i) => (
            <Reveal key={project.id} delay={i * 0.05}>
              <article className="glass-panel group overflow-hidden">
                {/* room header */}
                <div className="relative flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.06] px-8 py-6">
                  <div className="flex items-center gap-6">
                    <h3 className="text-h3 font-medium uppercase text-pearl transition-colors duration-500 ease-soft group-hover:text-cool-blue">
                      {project.title}
                    </h3>
                  </div>
                  <p className="font-mono text-xs uppercase tracking-[0.2em] text-pearl/40">
                    {project.tag}
                  </p>
                </div>

                {/* room body */}
                <div className="grid grid-cols-1 gap-x-10 gap-y-8 px-8 py-8 md:grid-cols-2">
                  <div className="space-y-6">
                    <div>
                      <p className="overline mb-2">MASALAH</p>
                      <p className="text-sm leading-relaxed text-pearl/70">
                        {project.problem}
                      </p>
                    </div>
                    <div>
                      <p className="overline mb-2">SOLUSI</p>
                      <p className="text-sm leading-relaxed text-pearl/70">
                        {project.solution}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col justify-between gap-8">
                    <div>
                      <p className="overline mb-2">TEKNOLOGI</p>
                      <div className="flex flex-wrap gap-2">
                        {project.technology.map((tech) => (
                          <span
                            key={tech}
                            className="rounded-full border border-white/12 px-3 py-1 font-mono text-xs text-pearl/70"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="overline mb-2">HASIL</p>
                      <p className="text-sm leading-relaxed text-pearl/70">
                        {project.result}
                      </p>
                    </div>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}