"use client";

import Image from "next/image";
import { CheckCircle2 } from "lucide-react";
import { getProjects } from "@/data/projects";
import { ProjectsBackdrop3DLoader } from "@/components/solutions/ProjectsBackdrop3DLoader";
import { ProjectSectionReveal, useSectionRefs } from "@/components/solutions/ProjectSectionReveal";
import { HeroAnimation } from "@/components/3d/HeroAnimatino";
import { useLanguage } from "@/context/LanguageContext";

// Oգնող ֆունկցիա՝ ստուգելու արդյոք URL-ը տեսանյութ է
const isVideoFile = (url: string) => {
  return /\.(mp4|mov|webm|ogg)$/i.test(url);
};

function ProjectCard({
  project,
  textFirst,
  sectionIndex,
}: {
  project: ReturnType<typeof getProjects>[number];
  textFirst: boolean;
  sectionIndex: number;
}) {
  const { textRef, mediaRef } = useSectionRefs();
  const { language, t } = useLanguage();
  const sp = t.solutions;

  return (
    <section className="relative overflow-hidden" >
      <div className="relative container-x py-28 md:py-36">
        <div className="grid gap-20 lg:grid-cols-12 items-center">
          <HeroAnimation />

          {/* TEXT SIDE */}
          <div
            ref={textRef}
            className={`lg:col-span-5 space-y-8 rounded-3xl border border-zinc-200 bg-white/90 backdrop-blur-md  md:p-10 shadow-xl ${
              textFirst ? "lg:order-1" : "lg:order-2"
            }`}
          >
            <span className="inline-flex rounded-full border border-[#00c050]/20 bg-[#00c050]/10 px-4 py-2 text-xs uppercase tracking-widest text-[#00c050] font-medium ml-2">
              {project.tag}
            </span>

            <h2 className="text-4xl md:text-5xl font-bold leading-[1.1] tracking-tight text-black">
              {project.title}
            </h2>

            <p className="text-sm text-zinc-500 ml-4">{project.client}</p>
            <p className="text-lg leading-relaxed text-zinc-600">{project.description}</p>

            <div>
              <h3 className="mb-4 text-xs uppercase tracking-[0.25em] text-zinc-400">
                {sp?.technologiesLabel?.[language] || "Technologies"}
              </h3>
              <div className="flex flex-wrap gap-2">
                {project.tech.map((tech) => (
                  <span key={tech} className="rounded-lg border border-zinc-200 bg-white px-4 py-2 text-xs font-medium text-zinc-700">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex gap-4 rounded-2xl border border-[#00c050]/20 bg-[#00c050]/5 p-6">
              <CheckCircle2 className="mt-1 h-6 w-6 shrink-0 text-[#00c050]" />
              <div>
                <h3 className="text-xs uppercase tracking-widest text-[#00c050] font-semibold">
                  {sp?.businessOutcomeLabel?.[language] || "Business outcome"}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-zinc-700">{project.outcome}</p>
              </div>
            </div>
          </div>

          {/* MEDIA SIDE */}
          <div
            ref={mediaRef}
            className={`lg:col-span-7 ${textFirst ? "lg:order-2" : "lg:order-1"}`}
          >
            <div className="space-y-5">
              {/* HERO MEDIA */}
              <div className="group overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-2xl">
                {isVideoFile(project.gallery[0]) || project.mediaType === "video" ? (
                  <video
                    src={project.gallery[0]}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="aspect-[16/10] w-full object-cover transition duration-700 group-hover:scale-105"
                  />
                ) : (
                  <Image
                    src={project.gallery[0]}
                    alt={project.title}
                    width={1200}
                    height={700}
                    className="aspect-[16/10] w-full object-cover transition duration-700 group-hover:scale-105"
                  />
                )}
              </div>

              {/* SECONDARY GALLERY MEDIA */}
              <div className="grid grid-cols-2 gap-5">
                {project.gallery.slice(1, 3).map((item, i) => (
                  <div key={i} className="group overflow-hidden rounded-2xl border border-zinc-200 shadow-lg">
                    {isVideoFile(item) ? (
                      <video
                        src={item}
                        autoPlay
                        muted
                        loop
                        playsInline
                        className="aspect-[4/3] w-full object-cover transition duration-700 group-hover:scale-110"
                      />
                    ) : (
                      <Image
                        src={item}
                        alt={project.title}
                        width={600}
                        height={400}
                        className="aspect-[4/3] w-full object-cover transition duration-700 group-hover:scale-110"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function SolutionsPage() {
  const { language, t } = useLanguage();
  const sp = t.solutions;
  const projects = getProjects(language);

  return (
    <main className="bg-white text-black">
      {/* HERO SECTION */}
      <section 
        className="relative overflow-hidden border-b border-zinc-200 bg-white"
        style={{
          backgroundImage: 'url("/images/8P0dvMlzh43WU8kB1i38qf4uo2QIwUWzRTfq0rFG3BMz_CP0c5FlSNlxZT5v60zPCtz1uBwrqvg_JacljXIssDa3_8jt2C_1UQYMCd3qpm5TO0I-MACTem_EczAZGPL3Rw2WIl8WCNK18Txgx3NoAmirXPO69zebOoTMQwqpesjDo53kF3zkc9vTgtgTvN-5.jpeg")',
          backgroundSize: "contain",
          backgroundPosition: "100% 50%",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(0,192,80,0.08),transparent_50%)]" />
        
        <div className="relative container-x py-32 md:py-40">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#00c050]/30 bg-[#00c050]/10 px-4 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[#00c050] animate-pulse" />
            <span className="text-xs uppercase tracking-[0.3em] text-[#00c050] font-medium">
              {sp.eyebrow[language]}
            </span>
          </div>

          <h1 className="mt-8 max-w-4xl text-5xl md:text-7xl font-bold tracking-tight leading-[1.05] text-black">
            {sp.title1[language]}{" "}
            <span className="text-[#00c050]">
              {sp.title2[language]}
            </span>
          </h1>

          <p className="mt-8 max-w-3xl text-lg leading-relaxed text-zinc-600">
            {sp.description1[language]}
          </p>

          <p className="mt-4 max-w-3xl text-base leading-relaxed text-zinc-500">
            {sp.description2[language]}
          </p>

          <div className="mt-12 pt-8 border-t border-zinc-200/80">
            <h2 className="text-2xl md:text-3xl font-bold text-black tracking-tight">
              {sp.featuredTitle[language]}
            </h2>
            <p className="mt-2 text-sm md:text-base text-zinc-600">
              {sp.featuredSubtitle[language]}
            </p>
          </div>
        </div>
      </section>

      {/* PROJECTS SECTION WITH 3D SCROLL */}
      <div id="projects-scroll-container" className="relative">
        <ProjectsBackdrop3DLoader containerId="projects-scroll-container" />

        <div className="relative z-10">
          {projects.map((project, index) => (
            <ProjectSectionReveal key={project.slug} textFirst={index % 2 === 0} index={index}>
              <ProjectCard project={project} textFirst={index % 2 === 0} sectionIndex={index} />
            </ProjectSectionReveal>
          ))}
        </div>
      </div>
    </main>
  );
}