"use client";

import { useRef } from "react";
import Image from "next/image";
import { Member, team } from "@/data/team";
import { AboutBackdrop3DLoader } from "@/components/about/AboutBackdrop3DLoader";
import { AboutSectionReveal } from "@/components/about/AboutSectionReveal";
import { useLanguage } from "@/context/LanguageContext";
import { HeroScene } from "@/components/3d/HeroScen";
import { MemberCard } from "@/components/about/MemberCard";

const sectionTitles = {
  leaders: {
    hy: "Թիմի առաջնորդները",
    en: "Team Leaders / Key Leadership",
    ru: "Лидеры команды",
  },
  team: {
    hy: "Մեր թիմի անդամները",
    en: "Our Experts / Meet the Team",
    ru: "Наша команда / Наши специалисты",
  },
};

export default function AboutPage() {
  const activeIndexRef = useRef(0);
  const { language, t } = useLanguage();
  const ab = t.about;

  const leaders = team.filter((m) => m.isLeadership);
  const staff = team.filter((m) => !m.isLeadership);

  return (
   <div id="about-scroll-container" className="relative bg-white">
      {/* 3D-ն դիր որպես բացարձակ ֆոն (absolute) ամբողջ բլոկի տակ */}
      <HeroScene />
      <div className="absolute inset-0 z-0 pointer-events-none">
        <AboutBackdrop3DLoader containerId="about-scroll-container" activeIndexRef={activeIndexRef} />
      </div>

      {/* Եթե ուզում ես թեթև սպիտակ շերտ (overlay) 3D-ի վրա, դիր z-1, իսկ տեքստը z-10 */}
      <div className="absolute inset-0 z-1 bg-white/40 pointer-events-none" />

      <div className="relative z-10">
        {/* HERO */}
        <AboutSectionReveal index={0} activeIndexRef={activeIndexRef}>
          <section className="relative border-b border-border overflow-hidden min-h-[500px]">
            
            {/* Բովանդակությունը (Text-ը) տեղաշարժված է դեպի աջ (pl-6 md:pl-16) */}
            <div className="relative z-10 container-x py-24 md:py-32 bg-white/80 backdrop-blur-sm w-full rounded-3xl border border-border shadow-2xl">
              <div className="max-w-4xl pl-6 md:pl-16 text-left">
            
                <div className="inline-flex items-center gap-2 rounded-full border border-[#00c050]/20 bg-[#00c050]/10 px-4 py-1.5 backdrop-blur-md">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#00c050] animate-pulse" />
                  <span className="text-xs uppercase tracking-[0.3em] text-[#00c050] font-medium">
                    {ab.aboutUs[language]}
                  </span>
                </div>

                <h1 className="mt-8 text-5xl font-bold tracking-tight md:text-6xl leading-[1.05] text-zinc-900">
                  {ab.heroTitle[language]}
                </h1>

                <p className="mt-8 text-lg font-bold text-[#00c050]">
                  {ab.heroSubtitle1[language]}
                </p>

                <p className="mt-6 text-lg font-bold text-zinc-900">
                  {ab.heroSubtitle2[language]}
                </p>
                <p className="mt-6 text-lg font-bold text-zinc-900">
                    {ab.heroSubtitleTwo[language]}
                </p>

                <div className="mt-10 h-px w-24 bg-gradient-to-r from-[#00c050]/20 to-transparent" />
                <HeroScene />
              </div>
            </div>
            
          </section>
        </AboutSectionReveal>

        {/* TEAM */}
        <AboutSectionReveal index={3} activeIndexRef={activeIndexRef}>
          <section className="py-24">
            <HeroScene />
            <div className="container-x">
              {/* TOP HERO/ABOUT BLOCK */}
              <div className="grid gap-12 md:grid-cols-2 items-center mb-20">
                <div className="rounded-3xl border border-border bg-white/80 backdrop-blur-md p-8 md:p-10 shadow-xl">
                  <span className="text-xs font-semibold uppercase tracking-widest text-[#00c050]">
                    {ab.aboutUs[language]}
                  </span>

                  <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl text-zinc-900">
                    {ab.teamTitle[language]}
                  </h2>

                  <div className="mt-6 space-y-6 text-lg text-zinc-800 font-medium">
                    <p>{ab.teamText1[language]}</p>
                    <p>{ab.teamText2[language]}</p>
                  </div>
                </div>

                <div className="relative aspect-[4/3] w-full rounded-3xl border border-border bg-white shadow-2xl overflow-hidden">
                  <Image
                    src="/images/IMGL0074.jpg"
                    alt="The DigiBase team"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>

              {/* TEAM SECTION CONTAINER */}
              <div className="space-y-20">
                {/* SECTION 1: LEADERSHIP (3 Members) */}
                <div>
                  <div className="mb-8 border-b border-zinc-200 pb-4">
                    <h3 className="text-2xl font-bold tracking-tight text-zinc-900 flex items-center gap-3">
                      <span className="h-2.5 w-2.5 rounded-full bg-[#00c050]" />
                      {sectionTitles.leaders[language]}
                    </h3>
                  </div>

                  <div className="grid gap-10 sm:grid-cols-3 max-w-5xl mx-auto [&>:hover]:z-50 relative">
                    {leaders.map((member) => (
                      <MemberCard
                        key={member.id}
                        member={member}
                        language={language}
                        isLeader
                      />
                    ))}
                  </div>
                </div>

                {/* SECTION 2: STAFF MEMBERS (4 Members) */}
                <div>
                  <div className="mb-8 border-b border-zinc-200 pb-4">
                    <h3 className="text-2xl font-bold tracking-tight text-zinc-900 flex items-center gap-3">
                      <span className="h-2.5 w-2.5 rounded-full bg-zinc-400" />
                      {sectionTitles.team[language]}
                    </h3>
                  </div>

                  <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
                    {staff.map((member) => (
                      <MemberCard
                        key={member.id}
                        member={member}
                        language={language}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        </AboutSectionReveal>

        {/* MISSION / PHILOSOPHY */}
        <AboutSectionReveal index={1} activeIndexRef={activeIndexRef}>
          <section className="border-b border-border py-24">
            <div className="container-x grid gap-12 md:grid-cols-2 items-center pl-5 pr-5">
              <div className="rounded-3xl border border-border bg-white/80 backdrop-blur-md p-8 md:p-10 shadow-xl">
                <span className="text-xs font-semibold uppercase tracking-widest text-[#00c050]">
                  {ab.aboutUs[language]}
                </span>

                <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl text-zinc-900">
                </h2>

                <div className="mt-6 space-y-6 text-lg text-zinc-800 font-medium">
                  <p>{ab.philosophyText1[language]}</p>
                </div>
              </div>

              <div className="relative aspect-[4/3] w-full rounded-3xl border border-border bg-white shadow-2xl overflow-hidden">
                <Image
                  src="/images/Gemini_Generated_Image_c7gg5zc7gg5zc7gg.png"
                  alt="DigiBase engineering philosophy"
                  fill
                  className="object-cover opacity-50"
                />
              </div>
            </div>
          </section>
        </AboutSectionReveal>

        {/* JOURNEY */}
        <AboutSectionReveal index={2} activeIndexRef={activeIndexRef}>
          <section className="border-b border-border py-24">
            <HeroScene />
            <div className="container-x">
              <div className="grid gap-12 md:grid-cols-2 items-center mb-16 pr-5 pl-5">
                <div className="rounded-3xl border border-border bg-white/80 backdrop-blur-md p-8 md:p-10 shadow-xl">
                  <span className="text-xs font-semibold uppercase tracking-widest text-[#00c050]">
                    {ab.aboutUs[language]}
                  </span>

                  <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl text-zinc-900">
                    {ab.journeyTitle[language]}
                  </h2>

                  <div className="mt-6 space-y-6 text-lg text-zinc-800 font-medium">
                    <p>{ab.journeyText1[language]}</p>
                    <p>{ab.journeyText2[language]}</p>
                  </div>
                </div>

                <div className="relative aspect-[4/3] w-full rounded-3xl border border-border bg-white shadow-2xl overflow-hidden pr-20">
                  <Image
                    src="/images/Gemini_Generated_Image_hrkxgahrkxgahrkx.png"
                    alt="DigiBase journey"
                    fill
                    className="object-cover opacity-50"
                  />
                </div>
              </div>
            </div>
          </section>
        </AboutSectionReveal>
      </div>
    </div>
  );
}