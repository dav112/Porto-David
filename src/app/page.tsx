import Hero from "@/components/sections/hero";
import Gallery from "@/components/sections/gallery";
import Page3Collage from "@/components/sections/page3-collage";
import About from "@/components/sections/about";
import Projects from "@/components/sections/projects";

export default function Home() {
  return (
    <main>
      <Hero />
      <Gallery />
      <Page3Collage />
      <About />
      <Projects />
    </main>
  );
}