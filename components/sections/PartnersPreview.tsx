
"use client";



import Link from "next/link";

import { Building2, ShieldCheck, Users } from "lucide-react";

import { BlurReveal } from "@/components/ui/TextReveal";

import { useLanguage } from "@/context/LanguageContext";



export function PartnersPreview() {

const { language, t } = useLanguage();

const pp = t.partners;



return (

<section className="relative overflow-hidden py-28 md:py-36 bg-white p-10">

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




</div>

</section>

);

}