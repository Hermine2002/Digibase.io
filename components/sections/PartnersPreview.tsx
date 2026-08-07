"use client";

import Link from "next/link";
import { Building2, ShieldCheck, Users } from "lucide-react";
import { BlurReveal } from "@/components/ui/TextReveal";
import { useLanguage } from "@/context/LanguageContext";
import { DigibaseModel } from "@/components/3d/DigibaseModel"; // <--- Import anelu zyp@

export function PartnersPreview() {
  const { language, t } = useLanguage();
  const pp = t.partners;

  return (
    <section className="relative overflow-hidden py-28 md:py-36 bg-white p-10">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-white via-zinc-50 to-white" />
      <div className="absolute left-1/2 top-0 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-[#00c050]/10 blur-[120px]" />

      <div className="container-x">
        {/* Grid orinak, vorpeszi text-n u 3D model-@ linen koxk-koxqi kam irar vra */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Dzax hatvac - Textayin masy */}
          <div className="lg:col-span-7">
            <BlurReveal>
              <div className="max-w-2xl">
                <span className="text-xs font-semibold uppercase tracking-widest text-[#00c050]">
                  {pp.eyebrow[language]}
                </span>

                <h2 className="mt-5 text-4xl font-bold tracking-tight text-black md:text-6xl">
                  {pp.title[language]}{" "}
                  <span className="text-[#00c050]">
                    {pp.trust[language]}
                  </span>
                </h2>

                <p className="mt-7 text-lg leading-8 text-zinc-600">
                  {pp.description1[language]}
                </p>
                <p className="mt-5 text-lg leading-8 text-zinc-600">
                  {pp.description2[language]}
                </p>
                <p className="mt-5 text-lg leading-8 font-medium text-zinc-800">
                  {pp.description3[language]}
                </p>
              </div>
            </BlurReveal>
          </div>

          {/* Aj hatvac - 3D Digibase Model-@ */}
          <div className="lg:col-span-5 flex justify-center items-center">
            <div className="w-full relative rounded-2xl border border-zinc-100 bg-zinc-50/50 shadow-inner p-4">
              <DigibaseModel />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}