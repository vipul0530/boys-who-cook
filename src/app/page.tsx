import Image from "next/image";
import Link from "next/link";
import { getHomePage, getPrograms } from "@/lib/content";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Home" };

/** Returns true for valid uploadable URLs; rejects file:// local paths */
function isValidUrl(url?: string): boolean {
  if (!url || url.trim() === "") return false;
  if (url.startsWith("file://")) return false;
  return true;
}

export default function HomePage() {
  const home = getHomePage();
  const programs = getPrograms().slice(0, 3);
  const heroImageValid = isValidUrl(home.hero.image);

  return (
    <>
      {/* ══════════════════════════════════════════════════════════════
          HERO  — split layout: text left · photo right (matches Wix)
          ══════════════════════════════════════════════════════════════ */}
      <section className="min-h-[88vh] flex flex-col md:flex-row">

        {/* Left — text */}
        <div className="flex-1 flex items-center justify-center px-10 py-20 md:py-0 bg-white order-2 md:order-1">
          <div className="max-w-lg">
            {/* Small label */}
            {home.hero.subheading && (
              <p
                className="text-xs font-semibold uppercase tracking-[0.2em] mb-4"
                style={{ color: "var(--color-secondary-600)" }}
              >
                {home.hero.subheading}
              </p>
            )}

            {/* Big serif heading */}
            <h1
              className="font-serif text-5xl md:text-6xl lg:text-7xl font-semibold leading-tight mb-6"
              style={{ color: "var(--color-primary-700)" }}
            >
              {home.hero.heading}
            </h1>

            {/* Description */}
            {home.hero.description && (
              <p className="text-gray-500 text-base leading-relaxed mb-8 max-w-sm">
                {home.hero.description}
              </p>
            )}

            {/* Buttons */}
            <div className="flex flex-wrap gap-3">
              <Link href={home.hero.cta_link} className="btn-primary">
                {home.hero.cta_text}
              </Link>
              {home.hero.cta_secondary_text && home.hero.cta_secondary_link && (
                <Link href={home.hero.cta_secondary_link} className="btn-secondary">
                  {home.hero.cta_secondary_text}
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Right — photo */}
        <div
          className="flex-1 relative min-h-[50vh] md:min-h-[88vh] order-1 md:order-2"
          style={{
            backgroundColor: heroImageValid ? undefined : "var(--color-primary-100)",
          }}
        >
          {heroImageValid ? (
            <Image
              src={home.hero.image!}
              alt="Boys Who Cook"
              fill
              className="object-cover"
              priority
            />
          ) : (
            /* Placeholder shown until Shaan uploads a real photo */
            <div
              className="absolute inset-0 flex flex-col items-center justify-center gap-4"
              style={{ background: "linear-gradient(160deg, var(--color-primary-100) 0%, var(--color-primary-200) 100%)" }}
            >
              <div className="text-9xl opacity-30">👨‍🍳</div>
              <p
                className="text-sm font-medium opacity-60"
                style={{ color: "var(--color-primary-700)" }}
              >
                Upload a hero photo via Admin → Home Page
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          QUOTES — 3-column with teal borders (matches Wix exactly)
          ══════════════════════════════════════════════════════════════ */}
      {home.quotes && home.quotes.length > 0 && (
        <section className="bg-slate-50 border-t border-b" style={{ borderColor: "var(--quote-border)" }}>
          <div className="grid grid-cols-1 md:grid-cols-3">
            {home.quotes.map((q, i) => (
              <div
                key={i}
                className={`px-10 py-14 text-center ${
                  i < home.quotes.length - 1
                    ? "border-b md:border-b-0 md:border-r"
                    : ""
                }`}
                style={{ borderColor: "var(--quote-border)" }}
              >
                {/* Big quotation mark */}
                <div
                  className="text-6xl font-serif font-bold leading-none mb-4 quote-mark"
                >
                  &ldquo;
                </div>

                {/* Attribution */}
                <p
                  className="font-semibold text-sm mb-0.5"
                  style={{ color: "var(--color-primary-700)" }}
                >
                  {q.source}
                </p>
                {q.role && (
                  <p className="text-xs text-gray-400 italic mb-5">{q.role}</p>
                )}
                {!q.role && <div className="mb-5" />}

                {/* Quote */}
                <p className="text-gray-600 text-sm leading-relaxed">{q.text}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════════════════════════
          MISSION
          ══════════════════════════════════════════════════════════════ */}
      <section className="section">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <p
                className="text-xs font-semibold uppercase tracking-widest mb-3"
                style={{ color: "var(--color-secondary-600)" }}
              >
                Who We Are
              </p>
              <h2
                className="font-serif text-3xl md:text-4xl font-semibold mb-6 leading-tight"
                style={{ color: "var(--color-primary-700)" }}
              >
                {home.mission.heading}
              </h2>
              <p className="text-gray-500 leading-relaxed text-base mb-8">
                {home.mission.text}
              </p>
              <Link href="/about" className="btn-primary">
                Our Full Story
              </Link>
            </div>

            <div>
              {isValidUrl(home.mission.image) ? (
                <Image
                  src={home.mission.image!}
                  alt="Our Mission"
                  width={600}
                  height={450}
                  className="rounded-2xl shadow-md object-cover w-full"
                />
              ) : (
                <div
                  className="rounded-2xl h-72 flex items-center justify-center"
                  style={{ background: "var(--color-primary-50)" }}
                >
                  <div className="text-center opacity-50">
                    <div className="text-6xl mb-2">🍳</div>
                    <p className="text-sm" style={{ color: "var(--color-primary-700)" }}>
                      Add a photo via Admin → Home Page → Mission
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          IMPACT STATS BAR
          ══════════════════════════════════════════════════════════════ */}
      <section className="py-14 px-4" style={{ backgroundColor: "var(--color-primary-700)" }}>
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center text-white">
            {home.stats.map((stat, i) => (
              <div
                key={i}
                className={`${
                  i < home.stats.length - 1
                    ? "border-b sm:border-b-0 sm:border-r border-white/20 pb-8 sm:pb-0 sm:pr-8"
                    : ""
                }`}
              >
                <div className="font-serif text-5xl font-semibold mb-1">{stat.number}</div>
                <div className="text-white/70 text-xs uppercase tracking-widest font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          PROGRAMS PREVIEW
          ══════════════════════════════════════════════════════════════ */}
      <section className="section-alt">
        <div className="container">
          <div className="text-center mb-12">
            <p
              className="text-xs font-semibold uppercase tracking-widest mb-3"
              style={{ color: "var(--color-secondary-600)" }}
            >
              What We Offer
            </p>
            <h2
              className="font-serif text-3xl md:text-4xl font-semibold"
              style={{ color: "var(--color-primary-700)" }}
            >
              {home.programs_section.heading}
            </h2>
            {home.programs_section.subheading && (
              <p className="text-gray-500 max-w-xl mx-auto mt-4 text-base">
                {home.programs_section.subheading}
              </p>
            )}
          </div>

          {programs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {programs.map((program) => (
                <div key={program.slug} className="card group">
                  {isValidUrl(program.image) ? (
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={program.image}
                        alt={program.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  ) : (
                    <div
                      className="h-48 flex items-center justify-center text-4xl"
                      style={{ background: "var(--color-primary-50)" }}
                    >
                      🍽️
                    </div>
                  )}
                  <div className="p-6">
                    <h3
                      className="font-semibold text-base mb-2"
                      style={{ color: "var(--color-primary-700)" }}
                    >
                      {program.title}
                    </h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{program.excerpt}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-400 py-10">
              Add programs via the Admin panel to display them here.
            </p>
          )}

          <div className="text-center mt-10">
            <Link href="/programs" className="btn-secondary">
              View All Programs
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          DONATE CTA BANNER
          ══════════════════════════════════════════════════════════════ */}
      <section
        className="py-20 px-4 text-center text-white"
        style={{ background: "linear-gradient(135deg, var(--color-primary-700) 0%, var(--color-primary-900) 100%)" }}
      >
        <div className="max-w-2xl mx-auto">
          <h2 className="font-serif text-3xl md:text-4xl font-semibold mb-4">
            {home.cta_section.heading}
          </h2>
          <p className="text-white/75 text-base mb-8 leading-relaxed">
            {home.cta_section.text}
          </p>
          <Link href={home.cta_section.button_link} className="btn-outline-white">
            {home.cta_section.button_text}
          </Link>
        </div>
      </section>
    </>
  );
}
