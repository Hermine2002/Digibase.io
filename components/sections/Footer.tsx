"use client";

import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";

const footerLinks = {
  company: [
    { labelKey: "aboutUs", href: "/about" },
    { labelKey: "ourTeam", href: "/about#team" },
    { labelKey: "careers", href: "/careers" },
    { labelKey: "contact", href: "/contact" },
  ],
  solutions: [
    { labelKey: "dataCenters", href: "/solutions#datacenters" },
    { labelKey: "cloudInfrastructure", href: "/solutions#cloud" },
    { labelKey: "securitySystems", href: "/solutions#security" },
    { labelKey: "networkSolutions", href: "/solutions#network" },
  ],
  resources: [
    { labelKey: "caseStudies", href: "/case-studies" },
    { labelKey: "blog", href: "/blog" },
    { labelKey: "documentation", href: "/docs" },
    { labelKey: "support", href: "/support" },
  ],
};

export function Footer() {
  const { language, t } = useLanguage();
  // 'Record<string, any>' cast-y dzel e indexing-i hamar bolor error-nery
  const f = (t.footer || {}) as Record<string, Record<string, string> | undefined>;

  return (
    <footer className="bg-black text-white">
      <div className="section-padding py-16 lg:py-20">
        <div className="container-wide">
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8">
            
            {/* Brand */}
            <div className="lg:col-span-2">
              <Link href="/" className="flex items-center gap-3 mb-6">
                <div className="relative h-20 w-36">
                  <Image
                    src="/images/download (2).png"
                    alt="DigiBase"
                    fill
                    className="object-contain"
                  />
                </div>
              </Link>
              <p className="text-zinc-400 text-sm leading-relaxed max-w-sm mb-6">
                {f.description?.[language] || "DIGIBASE delivers enterprise technology solutions."}
              </p>
              <div className="flex gap-4">
                {["LinkedIn", "Twitter", "Facebook"].map((social) => (
                  <a
                    key={social}
                    href="#"
                    className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#00c050]/20 transition-colors"
                  >
                    <span className="text-xs font-medium">{social[0]}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Company Links */}
            <div>
              <h3 className="font-semibold mb-4 text-sm tracking-wider uppercase">
                {f.companyTitle?.[language] || "Company"}
              </h3>
              <ul className="space-y-3">
                {footerLinks.company.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-zinc-400 hover:text-white transition-colors text-sm"
                    >
                      {f[link.labelKey]?.[language] || link.labelKey}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Solutions Links */}
            <div>
              <h3 className="font-semibold mb-4 text-sm tracking-wider uppercase">
                {f.solutionsTitle?.[language] || "Solutions"}
              </h3>
              <ul className="space-y-3">
                {footerLinks.solutions.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-zinc-400 hover:text-white transition-colors text-sm"
                    >
                      {f[link.labelKey]?.[language] || link.labelKey}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources Links */}
            <div>
              <h3 className="font-semibold mb-4 text-sm tracking-wider uppercase">
                {f.resourcesTitle?.[language] || "Resources"}
              </h3>
              <ul className="space-y-3">
                {footerLinks.resources.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-zinc-400 hover:text-white transition-colors text-sm"
                    >
                      {f[link.labelKey]?.[language] || link.labelKey}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-zinc-500 text-sm">
              &copy; {new Date().getFullYear()} DigiBase. {f.copyright?.[language] || "All rights reserved."}
            </p>

            <div className="flex flex-wrap gap-6 text-sm">
              <Link href="/privacy" className="text-zinc-500 hover:text-white transition-colors">
                {f.privacy?.[language] || "Privacy Policy"}
              </Link>
              <Link href="/terms" className="text-zinc-500 hover:text-white transition-colors">
                {f.terms?.[language] || "Terms of Service"}
              </Link>
              <Link href="/compliance" className="text-zinc-500 hover:text-white transition-colors">
                {f.compliance?.[language] || "Compliance Statement"}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}