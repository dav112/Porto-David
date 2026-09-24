"use client";

import { motion } from "framer-motion";
import Button from "@/components/ui/button";

export default function ProjectsPage() {
  return (
    <section className="relative min-h-svh w-full flex items-center justify-center bg-background px-[var(--gutter)]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_40%_at_50%_50%,rgba(216,235,243,0.05),transparent_70%)]"
      />

      <motion.div
        className="relative z-10 flex flex-col items-center gap-8 text-center"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <motion.h2
          className="text-h2 font-medium uppercase text-pearl"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Pilih Portfolio
        </motion.h2>
        <motion.p
          className="max-w-md text-pearl/70 leading-relaxed"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          Jelajahi karya-karya saya di bidang desain dan video
        </motion.p>

        <motion.div
          className="flex flex-col gap-4 sm:flex-row"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Button
            variant="primary"
            className="w-full sm:w-auto min-w-[200px]"
            onClick={() =>
              window.open(
                "https://drive.google.com/drive/folders/1jKdGFMIbvkWYSqT1DHPVuvhrR75ELF2j?usp=sharing",
                "_blank"
              )
            }
          >
            Porto Desain
          </Button>
          <Button
            variant="ghost"
            className="w-full sm:w-auto min-w-[200px]"
            onClick={() =>
              window.open(
                "https://drive.google.com/drive/folders/1SGo_6k_3BN9sfCfi0243Qkj2lqKdkrmu?usp=sharing",
                "_blank"
              )
            }
          >
            Porto Video
          </Button>
        </motion.div>
      </motion.div>
    </section>
  );
}