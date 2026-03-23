import Image from "next/image";
import Link from "next/link";
import { getPrograms } from "@/lib/content";
import { marked } from "marked";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Programs" };

export default function ProgramsPage() {
  const programs = getPrograms();

  return (
    <>
      {/* Page Header */}
      <div className="page-header">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold font-heading mb-4">
            Our Programs
          </h1>
          <p className="text-white/85 text-lg">
            From beginners to advanced chefs — we have a program for every young man ready to learn.
          </p>
        </div>
      </div>

      {/* Programs List */}
      <section className="section">
        <div className="container">
          {programs.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <div className="text-6xl mb-4">📚</div>
              <p className="text-lg">No programs yet. Add them via the Admin panel.</p>
            </div>
          ) : (
            <div className="space-y-16">
              {programs.map((program, i) => {
                const bodyHtml = marked.parse(program.body || "");
                const isEven = i % 2 === 0;
                return (
                  <div
                    key={program.slug}
                    className={`grid grid-cols-1 lg:grid-cols-2 gap-10 items-center ${
                      !isEven ? "lg:flex-row-reverse" : ""
                    }`}
                  >
                    {/* Image — flip order on alternate rows */}
                    <div className={!isEven ? "lg:order-2" : ""}>
                      {program.image ? (
                        <Image
                          src={program.image}
                          alt={program.title}
                          width={600}
                          height={400}
                          className="rounded-2xl shadow-lg object-cover w-full h-72 lg:h-80"
                        />
                      ) : (
                        <div
                          className={`rounded-2xl h-72 lg:h-80 flex items-center justify-center ${
                            i % 3 === 0
                              ? "bg-gradient-to-br from-orange-100 to-amber-100"
                              : i % 3 === 1
                              ? "bg-gradient-to-br from-green-100 to-emerald-100"
                              : "bg-gradient-to-br from-blue-100 to-indigo-100"
                          }`}
                        >
                          <span className="text-8xl">
                            {i % 3 === 0 ? "🍳" : i % 3 === 1 ? "🥗" : "🍰"}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className={!isEven ? "lg:order-1" : ""}>
                      <div className="inline-flex items-center gap-2 bg-primary-50 text-primary-700 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide mb-4">
                        Program {String(i + 1).padStart(2, "0")}
                      </div>
                      <h2 className="text-2xl md:text-3xl font-bold font-heading text-gray-900 mb-3">
                        {program.title}
                      </h2>
                      <p className="text-primary-700 font-medium mb-4">
                        {program.excerpt}
                      </p>
                      <div
                        className="prose prose-sm prose-gray max-w-none text-gray-600"
                        dangerouslySetInnerHTML={{ __html: bodyHtml }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Join CTA */}
      <section className="section-alt">
        <div className="container text-center">
          <h2 className="text-3xl font-bold font-heading text-gray-900 mb-4">
            Ready to Join?
          </h2>
          <p className="text-gray-600 max-w-xl mx-auto mb-8 text-lg">
            All of our programs are free and open to boys in the community. Reach out to learn how to participate.
          </p>
          <Link href="/contact" className="btn-primary">
            Get In Touch
          </Link>
        </div>
      </section>
    </>
  );
}
