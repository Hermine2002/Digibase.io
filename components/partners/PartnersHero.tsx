"use client";

import { useLanguage } from "@/context/LanguageContext";

export function PartnersHero() {
  const { language, t } = useLanguage();
  const pp = t.partners;

  return (
    <section className="relative overflow-hidden border-b border-zinc-200 bg-white">
      <div
        className="absolute inset-1 bg-white/80 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('/images/Gemini_Generated_Image_y3eyjoy3eyjoy3ey.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      <div className="relative container-x py-24 md:py-32">
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50/80 px-4 py-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs uppercase tracking-[0.3em] text-emerald-700 font-medium">
            {pp.eyebrow[language]}
          </span>
        </div>

        <h1 className="mt-8 max-w-4xl text-4xl md:text-6xl font-bold tracking-tight leading-[1.1]">
          {pp.title[language]}{" "}
          <span className="text-[#00c050]">
            {pp.trust[language]}
          </span>
        </h1>

        <p className="mt-6 max-w-3xl text-base md:text-lg leading-relaxed text-[#00c050]">
          {pp.description1[language]}
        </p>

        <p className="mt-4 max-w-3xl text-sm md:text-base leading-relaxed text-zinc-500">
          {pp.description2[language]}
        </p>

        <p className="mt-4 max-w-3xl text-sm md:text-base leading-relaxed text-zinc-500">
          {pp.description3[language]}
        </p>

        <div className="mt-8 h-px w-24 bg-gradient-to-r from-emerald-500/60 to-transparent" />
      </div>
    </section>
  );
}