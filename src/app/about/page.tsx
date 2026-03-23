import Image from "next/image";
import Link from "next/link";
import { getAboutPage } from "@/lib/content";
import { marked } from "marked";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "About" };

export default function AboutPage() {
  const about = getAboutPage();
  const storyHtml = marked.parse(about.story.text || "");

  return (
    <>
      {/* Page Header */}
      <div className="page-header">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold font-heading mb-4">
            {about.title}
          </h1>
          <p className="text-white/85 text-lg">{about.subtitle}</p>
        </div>
      </div>

      {/* Our Story */}
      <section className="section">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block text-primary-600 font-semibold text-sm uppercase tracking-widest mb-3">
                How It Started
              </span>
              <h2 className="text-3xl md:text-4xl font-bold font-heading text-gray-900 mb-6">
                {about.story.heading}
              </h2>
              <div
                className="prose prose-gray max-w-none text-gray-600 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: storyHtml }}
              />
            </div>
            <div>
              {about.story.image ? (
                <Image
                  src={about.story.image}
                  alt="Our Story"
                  width={600}
                  height={500}
                  className="rounded-2xl shadow-xl object-cover w-full"
                />
              ) : (
                <div className="rounded-2xl bg-gradient-to-br from-orange-100 to-amber-100 h-96 flex items-center justify-center">
                  <div className="text-center text-orange-300">
                    <div className="text-8xl mb-3">📖</div>
                    <p className="text-orange-500 font-medium">Add story photo via Admin</p>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Mission */}
            <div className="card p-8">
              <div className="w-14 h-14 bg-primary-100 rounded-2xl flex items-center justify-center text-3xl mb-5">
                🎯
              </div>
              <h3 className="text-2xl font-bold font-heading text-gray-900 mb-4">
                {about.mission_vision.mission_heading}
              </h3>
              <p className="text-gray-600 leading-relaxed text-lg">
                {about.mission_vision.mission_text}
              </p>
            </div>
            {/* Vision */}
            <div className="card p-8">
              <div className="w-14 h-14 bg-secondary-100 rounded-2xl flex items-center justify-center text-3xl mb-5">
                🌟
              </div>
              <h3 className="text-2xl font-bold font-heading text-gray-900 mb-4">
                {about.mission_vision.vision_heading}
              </h3>
              <p className="text-gray-600 leading-relaxed text-lg">
                {about.mission_vision.vision_text}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      {about.values && about.values.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="text-center mb-12">
              <span className="inline-block text-primary-600 font-semibold text-sm uppercase tracking-widest mb-3">
                What We Stand For
              </span>
              <h2 className="text-3xl md:text-4xl font-bold font-heading text-gray-900">
                Our Core Values
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {about.values.map((value, i) => (
                <div
                  key={i}
                  className="text-center p-6 rounded-2xl bg-gradient-to-b from-orange-50 to-white border border-orange-100 hover:shadow-md transition-shadow"
                >
                  <div className="text-5xl mb-4">{value.icon}</div>
                  <h3 className="font-bold font-heading text-lg text-gray-900 mb-2">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="bg-primary-600 text-white py-16 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold font-heading mb-4">
            Want to Get Involved?
          </h2>
          <p className="text-white/85 mb-8">
            Whether you want to volunteer, donate, or partner with us, we&apos;d love to hear from you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="btn-secondary">
              Contact Us
            </Link>
            <Link href="/donate" className="btn-outline-white">
              Support Our Mission
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
