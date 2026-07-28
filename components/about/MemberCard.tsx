"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Member } from "@/data/team";

type Language = "hy" | "en" | "ru";

interface MemberCardProps {
  member: Member;
  language: Language;
  isLeader?: boolean;
  index?: number;
}

export function MemberCard({
  member,
  language,
  isLeader,
  index,
}: MemberCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [typedText, setTypedText] = useState("");

  const name = member.name[language] || member.name.hy;
  const role = member.role[language] || member.role.hy;

  // Typing Effect logic
  useEffect(() => {
    if (isHovered) {
      setTypedText(""); // Մաքրում ենք նախորդ տեքստը
      let i = 0;
      const timer = setInterval(() => {
        if (i < role.length) {
          setTypedText((prev) => prev + role.charAt(i));
          i++;
        } else {
          clearInterval(timer);
        }
      }, 30); // Տպվելու արագությունը (ms)

      return () => clearInterval(timer);
    } else {
      setTypedText(""); // Hover-ը հանելիս մաքրում ենք
    }
  }, [isHovered, role]);

  return (
    <div
      className="relative h-[320px] w-full cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* ================= 1. ԱՌԱՋԻՆ ՔԱՐՏ (Մայր քարտ, որը կորչում է hover-ի ժամանակ) ================= */}
      <div
        className={`absolute inset-0 flex flex-col items-center justify-center rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-md transition-all duration-500 ease-in-out ${
          isHovered
            ? "opacity-0 scale-95 pointer-events-none"
            : "opacity-100 scale-100"
        }`}
      >
        <div className="relative h-32 w-32 overflow-hidden rounded-2xl border-2 border-[#00c050]/20 shadow-inner">
          {member.photo ? (
            <Image
              src={member.photo}
              alt={name}
              fill
              sizes="128px"
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 grid place-items-center bg-zinc-100">
              <span className="text-3xl font-bold text-[#00c050]">
                {member.initials}
              </span>
            </div>
          )}
        </div>

        <h4 className="mt-4 text-lg font-bold tracking-tight text-black">
          {name}
        </h4>

        <span className="mt-2 text-xs font-semibold text-[#00c050] bg-[#00c050]/10 px-3 py-1 rounded-full">
          Hover to view details →
        </span>
      </div>

      {/* ================= 2. ԵՐԿՐՈՐԴ ՔԱՐՏ (Հայտնվում է hover անելիս) ================= */}
      <div
        className={`absolute inset-0 flex flex-col items-center justify-start rounded-3xl border border-[#00c050]/40 bg-gradient-to-b from-white via-white to-[#00c050]/10 p-6 text-center shadow-xl transition-all duration-500 ease-in-out ${
          isHovered
            ? "opacity-100 scale-100 pointer-events-auto"
            : "opacity-0 scale-95 pointer-events-none"
        }`}
      >
        {/* Նկարը երկրորդ քարտի վրա */}
        <div className="relative h-20 w-20 overflow-hidden rounded-full border-2 border-[#00c050] shadow-md ring-2 ring-[#00c050]/20">
          {member.photo ? (
            <Image
              src={member.photo}
              alt={name}
              fill
              sizes="80px"
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 grid place-items-center bg-zinc-100">
              <span className="text-xl font-bold text-[#00c050]">
                {member.initials}
              </span>
            </div>
          )}
        </div>

        {/* Անունը */}
        <h4 className="mt-3 text-base font-bold text-black border-b border-zinc-200 pb-2 w-full">
          {name}
        </h4>

        {/* ՀԵՐԹՈՎ ՏՊՎՈՂ ԻՆՖՈՐՄԱՑԻԱ (Typing effect) */}
        <div className="mt-3 w-full text-left">
          <p className="text-xs leading-relaxed text-zinc-700 font-medium min-h-[60px]">
            {typedText}
            {/* Տպող կուրսորի էֆեկտ */}
            {isHovered && (
              <span className="inline-block w-1.5 h-3 ml-0.5 bg-[#00c050] animate-pulse" />
            )}
          </p>
        </div>
      </div>
    </div>
  );
}