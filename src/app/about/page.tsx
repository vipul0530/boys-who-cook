import Image from "next/image";
import Link from "next/link";
import { getAboutPage } from "@/lib/content";
import { marked } from "marked";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "About" };

function isValidUrl(url?: string) {
  return !!url && url.trim() !== "" && !url.startsWith("file://");
}

export default function AboutPage() {
  const about = getAboutPage();
  const storyHtml = marked.parse(about.story.text || "");

  return (
    <>
      {/* Header */}
      <div className="page-header">
        <div className="max-w-2xl mx-auto">
          <h1 className="font-serif text-4xl md:text-5xl font-semibold mb-3">{about.title}</h1>
          <p className="text-white/75 text-base">{about.subtitle}</p>
        </div>
      </div>

      {/* Story */}
      <section className="section">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "var(--color-secondary-600)" }}>
                How It Started
              </p>
              <h2 className="font-serif text-3xl md:text-4xl font-semibold mb-6 leading-tight" style={{ color: "var(--color-primary-700)" }}>
                {about.story.heading}
              </h2>
              <div
                className="prose prose-gray max-w-none text-gray-500 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: storyHtml }}
              />
            </div>
            <div>
              {isValidUrl(about.story.image) ? (
                <Image
                  src={about.story.image!}
                  alt="Our Story"
                  width={600}
                  height={500}
                  className="rounded-2xl shadow-md object-cover w-full"
                />
              ) : (
                <div className="rounded-2xl h-96 flex items-center justify-center" style={{ background: "var(--color-primary-50)" }}>
                  <div className="text-center opacity-40">
                    <div className="text-7xl mb-3">📖</div>
                    <p className="text-sm" style={{ color: "var(--color-primary-700)" }}>Add story photo via Admin</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="section-alt">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card p-8">
              <div className="text-3xl mb-4">🎯</div>
              <h3 className="font-serif text-xl font-semibold mb-3" style={{ color: "var(--color-primary-700)" }}>
                {about.mission_vision.mission_heading}
              </h3>
              <p className="text-gray-500 leading-relaxed">{about.mission_vision.mission_text}</p>
            </div>
            <div className="card p-8">
              <div className="text-3xl mb-4">🌟</div>
              <h3 className="font-serif text-xl font-semibold mb-3" style={{ color: "var(--color-primary-700)" }}>
                {about.mission_vision.vision_heading}
              </h3>
              <p className="text-gray-500 leading-relaxed">{about.mission_vision.vision_text}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      {about.values?.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="text-center mb-12">
              <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "var(--color-secondary-600)" }}>
                What We Stand For
              </p>
              <h2 className="font-serif text-3xl font-semibold" style={{ color: "var(--color-primary-700)" }}>
                Our Core Values
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {about.values.map((v, i) => (
                <div key={i} className="card p-6 text-center">
                  <div className="text-4xl mb-3">{v.icon}</div>
                  <h3 className="font-semibold text-base mb-2" style={{ color: "var(--color-primary-700)" }}>{v.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{v.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-16 px-4 text-center text-white" style={{ background: "linear-gradient(135deg, var(--color-primary-700), var(--color-primary-900))" }}>
        <div className="max-w-xl mx-auto">
          <h2 className="font-serif text-2xl md:text-3xl font-semibold mb-4">Want to Get Involved?</h2>
          <p className="text-white/75 mb-7">Whether you want to volunteer, donate, or partner with us, we&apos;d love to hear from you.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/contact" className="btn-outline-white">Contact Us</Link>
            <Link href="/donate" className="btn-secondary">Donate</Link>
          </div>
        </div>
      </section>
    </>
  );
}
