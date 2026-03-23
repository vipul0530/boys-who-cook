import Image from "next/image";
import Link from "next/link";
import { getPrograms } from "@/lib/content";
import { marked } from "marked";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Programs" };

function isValidUrl(url?: string) {
  return !!url && url.trim() !== "" && !url.startsWith("file://");
}

export default function ProgramsPage() {
  const programs = getPrograms();

  return (
    <>
      <div className="page-header">
        <div className="max-w-2xl mx-auto">
          <h1 className="font-serif text-4xl md:text-5xl font-semibold mb-3">Our Programs</h1>
          <p className="text-white/75 text-base">From beginners to advanced — a program for every young man ready to learn.</p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          {programs.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <div className="text-5xl mb-4">📚</div>
              <p>No programs yet. Add them via the Admin panel.</p>
            </div>
          ) : (
            <div className="space-y-20">
              {programs.map((program, i) => {
                const bodyHtml = marked.parse(program.body || "");
                const flip = i % 2 !== 0;
                return (
                  <div key={program.slug} className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center`}>
                    <div className={flip ? "lg:order-2" : ""}>
                      {isValidUrl(program.image) ? (
                        <Image
                          src={program.image}
                          alt={program.title}
                          width={600}
                          height={400}
                          className="rounded-2xl shadow-md object-cover w-full h-72"
                        />
                      ) : (
                        <div className="rounded-2xl h-72 flex items-center justify-center text-6xl" style={{ background: "var(--color-primary-50)" }}>
                          {["🍳", "🥗", "🍰"][i % 3]}
                        </div>
                      )}
                    </div>
                    <div className={flip ? "lg:order-1" : ""}>
                      <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "var(--color-secondary-600)" }}>
                        Program {String(i + 1).padStart(2, "0")}
                      </p>
                      <h2 className="font-serif text-2xl md:text-3xl font-semibold mb-3 leading-tight" style={{ color: "var(--color-primary-700)" }}>
                        {program.title}
                      </h2>
                      <p className="text-gray-500 font-medium mb-4 text-sm">{program.excerpt}</p>
                      <div className="prose prose-sm prose-gray max-w-none text-gray-500" dangerouslySetInnerHTML={{ __html: bodyHtml }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <section className="section-alt text-center">
        <div className="container max-w-xl">
          <h2 className="font-serif text-2xl md:text-3xl font-semibold mb-4" style={{ color: "var(--color-primary-700)" }}>
            Ready to Join?
          </h2>
          <p className="text-gray-500 mb-7">All programs are free and open to boys in the community.</p>
          <Link href="/contact" className="btn-primary">Get In Touch</Link>
        </div>
      </section>
    </>
  );
}
