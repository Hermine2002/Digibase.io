"use client";

import { useRef } from "react";
import Image from "next/image";
import { Member, team } from "@/data/team";
import { AboutBackdrop3DLoader } from "@/components/about/AboutBackdrop3DLoader";
import { AboutSectionReveal } from "@/components/about/AboutSectionReveal";
import { useLanguage } from "@/context/LanguageContext";
import { HeroScene } from "@/components/3d/HeroSect";

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

function MemberCard({
  member,
  language,
  isLeader = false,
}: {
  member: Member;
  language: "hy" | "en" | "ru";
  isLeader?: boolean;
}) {
  const name = member.name[language] || member.name.hy;
  const role = member.role[language] || member.role.hy;

  if (isLeader) {
    // ՂԵԿԱՎԱՐՆԵՐԻ ՔԱՐՏ (Կողքից 3D բացվող պատուհանով)
    return (
      <div className="group relative z-10 [perspective:1000px]">
        <div className="relative flex flex-col items-center rounded-3xl border border-zinc-200/90 bg-gradient-to-b from-white via-white to-[#00c050]/5 p-6 text-center backdrop-blur-md transition-all duration-500 group-hover:-translate-y-2 group-hover:scale-[1.02] group-hover:border-[#00c050]/50 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.05)] group-hover:shadow-[0_20px_40px_-10px_rgba(0,192,80,0.2)]">
          
          {/* Avatar / Photo */}
          <div className="relative h-44 w-44 md:h-48 md:w-48 overflow-hidden rounded-2xl border border-[#00c050]/30 shadow-md ring-4 ring-[#00c050]/10 transition-transform duration-500 group-hover:scale-105">
            {member.photo ? (
              <Image
                src={member.photo}
                alt={name}
                fill
                sizes="192px"
                className="object-cover"
              />
            ) : (
              <div className="absolute inset-0 grid place-items-center bg-zinc-100">
                <span className="text-3xl font-bold text-[#00c050]">
                  {member.initials}
                </span>
              </div>
            )}
            <span className="absolute top-2 right-2 rounded-full bg-[#00c050] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-lg">
              Leader
            </span>
          </div>

          <h4 className="mt-5 text-base font-bold tracking-tight text-black">
            {name}
          </h4>

          {/* SIDE POP-OUT 3D PANEL (Կողքից բացվող պատուհան) */}
          <div className="pointer-events-none absolute left-1/2 top-0 z-50 w-72 -translate-x-1/2 translate-y-4 opacity-0 transition-all duration-500 ease-out group-hover:pointer-events-auto group-hover:left-[102%] group-hover:top-0 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100">
            <div className="relative rounded-2xl border border-[#00c050]/30 bg-white/95 p-5 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)] backdrop-blur-xl transition-all duration-300">
              <div className="flex items-center gap-2 border-b border-zinc-100 pb-3">
                <span className="h-2 w-2 rounded-full bg-[#00c050] animate-pulse" />
                <p className="text-xs font-bold uppercase tracking-wider text-[#00c050]">
                  {name}
                </p>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-zinc-700 font-medium">
                {role}
              </p>
              {/* 3D Arrow pointing back to card */}
              <div className="absolute -left-2 top-8 h-4 w-4 rotate-45 border-b border-l border-[#00c050]/30 bg-white" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ԱՇԽԱՏԱԿԻՑՆԵՐԻ ՔԱՐՏ (Տակից սահուն բացվող)
  return (
    <div className="group relative flex flex-col items-center rounded-3xl border border-zinc-200/80 bg-white p-6 text-center shadow-sm backdrop-blur-md transition-all duration-500 group-hover:-translate-y-1 group-hover:border-[#00c050]/30 group-hover:shadow-xl">
      <div className="relative h-36 w-36 md:h-40 md:w-40 overflow-hidden rounded-2xl border border-zinc-200 shadow-inner transition-transform duration-500 group-hover:scale-105">
        {member.photo ? (
          <Image
            src={member.photo}
            alt={name}
            fill
            sizes="160px"
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center bg-zinc-100">
            <span className="text-3xl font-bold text-zinc-400">
              {member.initials}
            </span>
          </div>
        )}
      </div>

      <h4 className="mt-4 text-base font-bold tracking-tight text-black">
        {name}
      </h4>

      {/* TEXT INSIDE CARD (Տակից բացվող) */}
      <div className="grid grid-rows-[0fr] opacity-0 transition-all duration-500 ease-in-out group-hover:mt-3 group-hover:grid-rows-[1fr] group-hover:opacity-100">
        <div className="overflow-hidden">
          <p className="border-t border-zinc-100 pt-3 text-xs leading-relaxed text-zinc-600">
            {role}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function AboutPage() {
  const activeIndexRef = useRef(0);
  const { language, t } = useLanguage();
  const ab = t.about;

  const leaders = team.filter((m) => m.isLeadership);
  const staff = team.filter((m) => !m.isLeadership);

  return (
    <div id="about-scroll-container" className="relative bg-white overflow-hidden">
      <AboutBackdrop3DLoader containerId="about-scroll-container" activeIndexRef={activeIndexRef} />

      <div className="fixed inset-0 -z-10 opacity-30" />
      <div className="fixed inset-0 -z-10 bg-white/70" />

      <div className="relative z-10">
        {/* HERO */}
        <AboutSectionReveal index={0} activeIndexRef={activeIndexRef}>
          <section
            className="border-b border-border"
            style={{
              backgroundImage: "url('/images/Gemini_Generated_Image_iulekuiulekuiule.png')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="container-x py-24 md:py-32 bg-white/70 w-100 rounded-3xl border border-border shadow-2xl overflow-hidden h-full">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#00c050]/20 bg-[#00c050]/10 px-4 py-1.5 backdrop-blur-md">
                <span className="h-1.5 w-1.5 rounded-full bg-[#00c050] animate-pulse" />
                <span className="text-xs uppercase tracking-[0.3em] text-[#00c050] font-medium">
                  {ab.aboutUs[language]}
                </span>
              </div>

              <h1 className="mt-8 max-w-3xl text-5xl font-bold tracking-tight md:text-6xl leading-[1.05] text-black">
                {ab.heroTitle[language]}
              </h1>

              <p className="mt-8 max-w-2xl text-lg text-[#00c050]">
                {ab.heroSubtitle1[language]}
              </p>

              <p className="mt-6 max-w-2xl text-lg text-zinc-600">
                {ab.heroSubtitle2[language]}
              </p>

              <div className="mt-10 h-px w-24 bg-gradient-to-r from-[#00c050]/60 to-transparent" />
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

                  <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl text-black">
                    {ab.teamTitle[language]}
                  </h2>

                  <div className="mt-6 space-y-6 text-lg text-zinc-600">
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
    <h3 className="text-2xl font-bold tracking-tight text-black flex items-center gap-3">
      <span className="h-2.5 w-2.5 rounded-full bg-[#00c050]" />
      {sectionTitles.leaders[language]}
    </h3>
  </div>

  {/* ԱՎԵԼԱՑՎԱԾ Է [&>:hover]:z-50 style-ը */}
  <div className="grid gap-10 sm:grid-cols-3 max-w-5xl mx-auto [&>:hover]:z-50 relative">
    {leaders.map((member, index) => (
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
                    <h3 className="text-2xl font-bold tracking-tight text-black flex items-center gap-3">
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
            <div className="container-x grid gap-12 md:grid-cols-2 items-center">
              <div className="rounded-3xl border border-border bg-white/80 backdrop-blur-md p-8 md:p-10 shadow-xl">
                <span className="text-xs font-semibold uppercase tracking-widest text-[#00c050]">
                  {ab.aboutUs[language]}
                </span>

                <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl text-black">
                  {ab.philosophyTitle[language]}
                </h2>

                <div className="mt-6 space-y-6 text-lg text-zinc-600">
                  <p>{ab.philosophyText1[language]}</p>
                </div>
              </div>

              <div className="relative aspect-[4/3] w-full rounded-3xl border border-border bg-white shadow-2xl overflow-hidden">
                <Image
                  src="/images/Gemini_Generated_Image_c7gg5zc7gg5zc7gg.png"
                  alt="DigiBase engineering philosophy"
                  fill
                  className="object-cover"
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
              <div className="grid gap-12 md:grid-cols-2 items-center mb-16">
                <div className="rounded-3xl border border-border bg-white/80 backdrop-blur-md p-8 md:p-10 shadow-xl">
                  <span className="text-xs font-semibold uppercase tracking-widest text-[#00c050]">
                    {ab.aboutUs[language]}
                  </span>

                  <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl text-black">
                    {ab.journeyTitle[language]}
                  </h2>

                  <div className="mt-6 space-y-6 text-lg text-zinc-600">
                    <p>{ab.journeyText1[language]}</p>
                  </div>
                </div>

                <div className="relative aspect-[4/3] w-full rounded-3xl border border-border bg-white shadow-2xl overflow-hidden">
                  <Image
                    src="/images/Gemini_Generated_Image_ezcqwmezcqwmezcq.png"
                    alt="DigiBase journey"
                    fill
                    className="object-cover"
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