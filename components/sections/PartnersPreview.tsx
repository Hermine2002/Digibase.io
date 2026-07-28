"use client";

import Link from "next/link";
import { Building2, ShieldCheck, Users } from "lucide-react";
import { BlurReveal } from "@/components/ui/TextReveal";
import { useLanguage } from "@/context/LanguageContext";

export function PartnersPreview() {
  const { language, t } = useLanguage();
  const pp = t.partners;

  return (
    <section className="relative overflow-hidden py-28 md:py-36 bg-white">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-white via-zinc-50 to-white" />
      <div className="absolute left-1/2 top-0 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-[#00c050]/10 blur-[120px]" />

      <div className="container-x">
        <BlurReveal>
          <div className="max-w-5xl">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#00c050]">
              {pp.eyebrow[language]}
            </span>

            <h2 className="mt-5 text-4xl font-bold tracking-tight text-black md:text-6xl">
              {pp.title[language]}{" "}
              <span className="text-[#00c050]">
                {pp.trust[language]}
              </span>
            </h2>

            <p className="mt-7 max-w-3xl text-lg leading-8 text-zinc-600">
              {pp.description1[language]}
            </p>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-zinc-600">
              {pp.description2[language]}
            </p>
            <p className="mt-5 max-w-3xl text-lg leading-8 font-medium text-zinc-800">
              {pp.description3[language]}
            </p>
          </div>
        </BlurReveal>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          <TrustCard
            icon={<Building2 className="text-[#00c050]" />}
            title={pp.trustCards.enterprise.title[language]}
            text={pp.trustCards.enterprise.text[language]}
          />
          <TrustCard
            icon={<ShieldCheck className="text-[#00c050]" />}
            title={pp.trustCards.security.title[language]}
            text={pp.trustCards.security.text[language]}
          />
          <TrustCard
            icon={<Users className="text-[#00c050]" />}
            title={pp.trustCards.team.title[language]}
            text={pp.trustCards.team.text[language]}
          />
        </div>
      </div>
    </section>
  );
}

function TrustCard({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-3xl border border-zinc-200 bg-white/80 p-8 shadow-lg backdrop-blur-md transition duration-500 hover:-translate-y-2 hover:shadow-2xl">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#00c050]/10 text-[#00c050]">
        {icon}
      </div>
      <h3 className="mt-6 text-xl font-bold text-black">{title}</h3>
      <p className="mt-3 text-sm leading-relaxed text-zinc-600">{text}</p>
    </div>
  );
}