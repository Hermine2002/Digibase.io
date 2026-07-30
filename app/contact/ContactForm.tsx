"use client";

import { useState, useEffect, useRef } from "react";
import { Mail, MapPin, Phone, Send } from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/context/LanguageContext";
import * as THREE from "three";

export default function ContactForm() {
  const [sending, setSending] = useState(false);
  const { language, t } = useLanguage();
  const contact = t.contact;

  const canvasContainerRef = useRef<HTMLDivElement>(null);

  // Three.js 3D ֆոնի ինտեգրում (ավելի փոքր մոդելով)
  useEffect(() => {
    if (!canvasContainerRef.current) return;

    let camera: THREE.PerspectiveCamera, scene: THREE.Scene, renderer: THREE.WebGLRenderer, clock: THREE.Clock;
    let mesh: THREE.Mesh;

    const container = canvasContainerRef.current;

    function init() {
      camera = new THREE.PerspectiveCamera(60, container.clientWidth / container.clientHeight, 0.1, 1000);
      camera.position.z = 5;

      scene = new THREE.Scene();
      clock = new THREE.Clock();

      // Փոքրացրած չափսեր (շառավիղը և խողովակի հաստությունը նվազեցված են)
      const geometry = new THREE.TorusKnotGeometry(0.7, 0.2, 128, 32);
      const material = new THREE.MeshBasicMaterial({
        color: 0x00c050,
        wireframe: true,
        transparent: true,
        opacity: 0.2,
      });

      mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);

      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(container.clientWidth, container.clientHeight);
      container.appendChild(renderer.domElement);

      window.addEventListener("resize", onWindowResize);
    }

    function onWindowResize() {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    }

    let animationFrameId: number;

    function animate() {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      if (mesh) {
        mesh.rotation.x += delta * 0.3;
        mesh.rotation.y += delta * 0.5;
      }

      renderer.render(scene, camera);
    }

    init();
    animate();

    return () => {
      window.removeEventListener("resize", onWindowResize);
      cancelAnimationFrame(animationFrameId);
      if (renderer && renderer.domElement) {
        container.removeChild(renderer.domElement);
        renderer.dispose();
      }
    };
  }, []);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSending(true);

    const fd = new FormData(e.currentTarget);

    const body = `
${contact.form.fullName[language]}: ${fd.get("name")}
${contact.form.company[language]}: ${fd.get("company")}
${contact.form.email[language]}: ${fd.get("email")}
${contact.form.phone[language]}: ${fd.get("phone")}
${contact.form.subject[language]}: ${fd.get("subject")}

${contact.form.message[language]}:
${fd.get("message")}
`;

    window.location.href = `mailto:info@digibase.am?subject=${encodeURIComponent(
      "DIGIBASE Inquiry"
    )}&body=${encodeURIComponent(body)}`;

    setTimeout(() => {
      toast.success(contact.toastSuccess[language]);
      setSending(false);
      e.currentTarget.reset();
    }, 500);
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-white">
      {/* BACKGROUND IMAGE / GRADIENT */}
      <div className="absolute inset-0 bg-[url('/images/contact-bg.jpg')] bg-cover bg-center opacity-10" />
      <div className="absolute inset-0 bg-gradient-to-b from-white/50 via-white/80 to-white" />

      {/* THREE.JS CONTAINER AS BACKGROUND */}
      <div ref={canvasContainerRef} className="absolute inset-0 z-0 pointer-events-none" />

      {/* HERO SECTION */}
      <section className="relative border-b border-zinc-200 overflow-hidden z-10">
        <div className="relative z-10 container-x py-32 md:py-40">
          <div className="max-w-4xl pl-6 md:pl-16 text-left">

            <span className="text-xs font-semibold uppercase tracking-[0.35em] text-[#00c050]">
              {contact.eyebrow[language]}
            </span>

            <h1 className="mt-6 text-5xl md:text-7xl font-bold tracking-tight text-zinc-900">
              {contact.heroTitle[language]}{" "}
              <span className="text-[#00c050]">
                {contact.heroTitleHighlight[language]}
              </span>
            </h1>

            <p className="mt-8 text-lg text-zinc-800 font-semibold leading-relaxed">
              {contact.heroDescription[language]}
            </p>

          </div>
        </div>
      </section>

      {/* MAIN CONTENT SECTION */}
      <section className="relative py-24 z-10">
        <div className="container-x grid gap-12 lg:grid-cols-12">
          {/* LEFT - CONTACT INFO */}
          <div className="lg:col-span-5 space-y-6">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-zinc-900 tracking-tight">
                {contact.officeTitle[language]}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-zinc-700 font-medium">
                {contact.officeDescription[language]}
              </p>
            </div>

            <ContactCard
              icon={<MapPin className="text-[#00c050]" />}
              title={contact.info.addressTitle[language]}
              text={contact.info.address[language]}
            />

            <ContactCard
              icon={<Mail className="text-[#00c050]" />}
              title={contact.info.emailTitle[language]}
              text="info@digibase.am"
            />

            <ContactCard
              icon={<Phone className="text-[#00c050]" />}
              title={contact.info.phoneTitle[language]}
              text="+374 12 488888"
            />

            {/* MAP */}
            <div className="mt-10 overflow-hidden rounded-[32px] border border-zinc-200 shadow-[0_40px_100px_rgba(0,0,0,.15)] transition duration-500 hover:-translate-y-2">
              <iframe
                title="DIGIBASE Location"
                src="https://www.google.com/maps?q=20+Baghramyan+Ave,+Yerevan,+Armenia&output=embed"
                className="h-[380px] w-full"
              />
            </div>
          </div>

          {/* RIGHT - FORM */}
          <form
            onSubmit={submit}
            className="lg:col-span-7 rounded-[32px] border border-zinc-200 bg-white/80 backdrop-blur-xl p-8 md:p-12 shadow-[0_40px_120px_rgba(0,0,0,.12)]"
          >
            <h2 className="text-3xl font-bold text-zinc-900">
              {contact.formTitle[language]}
            </h2>

            <p className="mt-3 text-zinc-700 font-medium">
              {contact.formSubtitle[language]}
            </p>

            <div className="mt-10 grid gap-6 md:grid-cols-2">
              <Field
                name="name"
                label={contact.form.fullName[language]}
                placeholder={contact.form.fullName[language]}
                required
              />

              <Field
                name="company"
                label={contact.form.company[language]}
                placeholder={contact.form.company[language]}
                required
              />

              <Field
                name="email"
                label={contact.form.email[language]}
                placeholder={contact.form.email[language]}
                type="email"
                required
              />

              <Field
                name="phone"
                label={contact.form.phoneOptional[language]}
                placeholder={contact.form.phoneOptional[language]}
              />

              <div className="md:col-span-2">
                <Field
                  name="subject"
                  label={contact.form.subject[language]}
                  placeholder={contact.form.subject[language]}
                />
              </div>
            </div>

            <div className="mt-6">
              <label className="text-xs font-semibold uppercase tracking-widest text-zinc-900">
                {contact.form.message[language]}
              </label>

              <textarea
                name="message"
                rows={6}
                required
                placeholder={contact.form.message[language]}
                className="mt-3 w-full rounded-2xl border border-zinc-200 bg-white px-5 py-4 text-zinc-900 font-medium outline-none transition focus:border-[#00c050]"
              />
            </div>

            <button
              disabled={sending}
              className="mt-8 inline-flex items-center gap-3 rounded-2xl bg-[#00c050] px-8 py-4 font-semibold text-white shadow-xl transition hover:-translate-y-1 hover:bg-[#00a042] disabled:opacity-50"
            >
              {sending ? contact.form.sending[language] : contact.form.send[language]}
              <Send size={18} />
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}

function ContactCard({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="group rounded-3xl border border-zinc-200 bg-white/70 backdrop-blur-xl p-7 shadow-lg transition duration-500 hover:-translate-y-2 hover:shadow-2xl">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#00c050]/10 text-[#00c050]">
          {icon}
        </div>

        <div>
          <h3 className="text-xs uppercase tracking-widest text-zinc-500 font-semibold">
            {title}
          </h3>
          <p className="mt-1 font-semibold text-zinc-900">{text}</p>
        </div>
      </div>
    </div>
  );
}

function Field({
  name,
  label,
  placeholder,
  type = "text",
  required,
}: {
  name: string;
  label: string;
  placeholder?: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="text-xs font-semibold uppercase tracking-widest text-zinc-900">
        {label}
      </label>

      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="mt-3 w-full rounded-2xl border border-zinc-200 bg-white px-5 py-4 text-zinc-900 font-medium outline-none transition focus:border-[#00c050]"
      />
    </div>
  );
}