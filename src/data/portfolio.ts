import type { Project, SkillGroup, TimelineItem } from "@/types";

export const profile = {
  name: "LUKMAN DAVID ARYANTO",
  roles: ["Creative Designer", "Full Stack Developer"],
};

export const timeline: TimelineItem[] = [
  {
    year: "2018",
    title: "Fondasi Desain",
    description:
      "Mendalami komunikasi visual dan menemukan kecintaan pada komposisi, warna, dan storytelling.",
  },
  {
    year: "2020",
    title: "Profesional Kreatif",
    description:
      "Membangun brand, karya motion, dan konten video untuk agensi — mematangkan keahlian komunikasi visual.",
  },
  {
    year: "2022",
    title: "Ekspresi Pertama dengan Kode",
    description:
      "Menulis HTML, CSS, dan JavaScript pertama. Halaman statis berubah menjadi prototipe interaktif. Jembatan itu mulai terlihat.",
  },
  {
    year: "2023",
    title: "Jalur Developer",
    description:
      "Menyelami Node.js, database, dan API — belajar bagaimana perangkat lunak dirancang, bukan hanya digambar.",
  },
  {
    year: "2025",
    title: "Full Stack",
    description:
      "Menggabungkan desain dan rekayasa dalam React, Next.js, TypeScript, serta menjelajahi Three.js untuk pengalaman 3D.",
  },
];

export const story =
  "Dari piksel ke kode — seorang desainer kreatif yang belajar membangun apa yang dulu hanya ia rancang. Karya saya hidup di persimpangan komunikasi visual dan rekayasa interaktif: setiap antarmuka adalah perpaduan antara niat desain dan kode yang presisi.";

export const skills: SkillGroup[] = [
  {
    category: "Frontend",
    skills: [
      { name: "React", level: 90 },
      { name: "Next.js", level: 85 },
      { name: "JavaScript", level: 90 },
      { name: "TypeScript", level: 80 },
    ],
  },
  {
    category: "Backend",
    skills: [
      { name: "Node.js", level: 80 },
      { name: "Database", level: 70 },
    ],
  },
  {
    category: "Kreatif",
    skills: [
      { name: "Desain UI", level: 95 },
      { name: "Motion Design", level: 85 },
      { name: "Editing Video", level: 90 },
      { name: "Branding", level: 85 },
    ],
  },
  {
    category: "3D",
    skills: [
      { name: "Three.js", level: 75 },
      { name: "Blender", level: 70 },
    ],
  },
];

export const projects: Project[] = [
  {
    id: "lumen",
    title: "Lumen — Sistem Antarmuka Brand",
    tag: "Branding / Sistem Desain",
    problem:
      "Sebuah brand ritel yang berkembang pesat memiliki tampilan visual yang tidak konsisten di berbagai titik sentuh digital dan fisik, mengikis pengenalan merek dan memperlambat output kreatif.",
    solution:
      "Merancang sistem antarmuka brand yang terpadu — tipografi, warna, motion, dan bahasa komponen — mengubah aset yang tersebar menjadi identitas yang koheren dan tunggal.",
    technology: ["Figma", "Design Tokens", "Motion Design", "Panduan Brand"],
    result:
      "Output kreatif dikirim 2× lebih cepat dengan konsistensi on-brand di seluruh web, media sosial, dan kemasan.",
  },
  {
    id: "motionlab",
    title: "MotionLab",
    tag: "Web / Motion",
    problem:
      "Halaman marketing statis gagal menyampaikan energi sebuah studio kreatif, menghasilkan keterlibatan rendah dan konversi yang lemah.",
    solution:
      "Membangun pengalaman web interaktif berbasis motion dengan koreografi scroll dan micro-interaction yang mencerminkan keahlian studio.",
    technology: ["Next.js", "GSAP", "Framer Motion", "Lenis"],
    result:
      "Waktu di halaman meningkat 64% dan bounce rate turun, mendorong pertanyaan klien naik 38%.",
  },
  {
    id: "chroma",
    title: "CHROMA — Pengalaman 3D",
    tag: "Creative Coding / 3D",
    problem:
      "Halaman produk 2D standar terasa datar bagi audiens premium yang berorientasi desain, gagal menyampaikan kualitas material dan inovasi.",
    solution:
      "Menghasilkan secara prosedural sebuah patung 3D chrome di browser, memadukan tipografi editorial dengan interaksi real-time yang imersif.",
    technology: ["Three.js", "React Three Fiber", "GLSL", "Next.js"],
    result:
      "Pengalaman ini menjadi karya unggulan — dibagikan secara luas dan digunakan sebagai showcase utama brand.",
  },
];
