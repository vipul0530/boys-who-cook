import Image from "next/image";
import Link from "next/link";
import { getHomePage, getPrograms } from "@/lib/content";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home",
};

export default function HomePage() {
  const home = getHomePage();
  const programs = getPrograms().slice(0, 3);

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
        {/* Background image or gradient */}
        {home.hero.image ? (
          <Image
            src={home.hero.image}
            alt="Boys Who Cook hero"
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-orange-400 via-orange-600 to-red-800" />
        )}
        {/* Overlay */}
        <div className="absolute inset-0 hero-overlay" />

        {/* Content */}
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6 text-sm font-medium">
            <span>🍳</span>
            <span>Nonprofit Organization</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-heading leading-tight mb-6 drop-shadow-md">
            {home.hero.heading}
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto mb-10 leading-relaxed">
            {home.hero.subheading}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={home.hero.cta_link} className="btn-primary text-base">
              {home.hero.cta_text}
            </Link>
            {home.hero.cta_secondary_text && home.hero.cta_secondary_link && (
              <Link href={home.hero.cta_secondary_link} className="btn-outline-white text-base">
                {home.hero.cta_secondary_text}
              </Link>
            )}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/60 animate-bounce">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </section>

      {/* ── Impact Stats ─────────────────────────────────────────────────── */}
      <section className="bg-primary-600 text-white py-12">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            {home.stats.map((stat, i) => (
              <div key={i} className="group">
                <div className="text-4xl md:text-5xl font-bold font-heading mb-2 group-hover:scale-110 transition-transform">
                  {stat.number}
                </div>
                <div className="text-primary-100 text-sm font-medium uppercase tracking-wide">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Mission ──────────────────────────────────────────────────────── */}
      <section className="section">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block text-primary-600 font-semibold text-sm uppercase tracking-widest mb-3">
                Who We Are
              </span>
              <h2 className="text-3xl md:text-4xl font-bold font-heading text-gray-900 mb-6 leading-tight">
                {home.mission.heading}
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-8">
                {home.mission.text}
              </p>
              <Link href="/about" className="btn-primary">
                Our Full Story →
              </Link>
            </div>
            <div className="relative">
              {home.mission.image ? (
                <Image
                  src={home.mission.image}
                  alt="Our Mission"
                  width={600}
                  height={450}
                  className="rounded-2xl shadow-xl object-cover w-full"
                />
              ) : (
                <div className="rounded-2xl bg-gradient-to-br from-orange-100 to-orange-200 h-80 flex items-center justify-center">
                  <div className="text-center text-orange-400">
                    <div className="text-7xl mb-4">🍳</div>
                    <p className="font-semibold text-orange-600">Add a mission photo via Admin</p>
                  </div>
                </div>
              )}
              {/* Decorative badge */}
              <div className="absolute -bottom-4 -right-4 bg-secondary-600 text-white rounded-2xl px-5 py-4 shadow-lg hidden md:block">
                <div className="text-2xl font-bold font-heading">100%</div>
                <div className="text-xs text-green-100">Free Programs</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Programs Preview ─────────────────────────────────────────────── */}
      <section className="section-alt">
        <div className="container">
          <div className="text-center mb-12">
            <span className="inline-block text-primary-600 font-semibold text-sm uppercase tracking-widest mb-3">
              Our Programs
            </span>
            <h2 className="text-3xl md:text-4xl font-bold font-heading text-gray-900 mb-4">
              {home.programs_section.heading}
            </h2>
            {home.programs_section.subheading && (
              <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                {home.programs_section.subheading}
              </p>
            )}
          </div>

          {programs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {programs.map((program) => (
                <div key={program.slug} className="card group">
                  {program.image ? (
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={program.image}
                        alt={program.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ) : (
                    <div className="h-48 bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center">
                      <span className="text-5xl">🍽️</span>
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="font-bold font-heading text-lg text-gray-900 mb-2">
                      {program.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {program.excerpt}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-400 py-10">
              Add programs via the Admin panel to display them here.
            </div>
          )}

          <div className="text-center mt-10">
            <Link href="/programs" className="btn-primary">
              View All Programs
            </Link>
          </div>
        </div>
      </section>

      {/* ── CTA Banner ───────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4">
            {home.cta_section.heading}
          </h2>
          <p className="text-white/85 text-lg mb-8 leading-relaxed">
            {home.cta_section.text}
          </p>
          <Link href={home.cta_section.button_link} className="btn-secondary text-base">
            {home.cta_section.button_text}
          </Link>
        </div>
      </section>
    </>
  );
}
