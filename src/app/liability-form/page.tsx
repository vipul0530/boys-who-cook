import type { Metadata } from "next";
import WaiverForm from "@/components/WaiverForm";

export const metadata: Metadata = { title: "Liability Form" };

export default function LiabilityFormPage() {
  return (
    <>
      {/* Header */}
      <div className="page-header">
        <div className="max-w-2xl mx-auto">
          <h1 className="font-serif text-4xl md:text-5xl font-semibold">Liability Form</h1>
        </div>
      </div>

      <section className="section" style={{ backgroundColor: "var(--color-primary-50)" }}>
        <div className="container max-w-3xl">
          {/* Intro */}
          <p className="text-gray-600 text-base md:text-lg leading-relaxed text-center mb-10">
            Please complete and sign this short waiver before your child&apos;s workshop. It
            takes about two minutes. You can sign it electronically below, or download a copy
            to print and bring with you.
          </p>

          {/* Option 1 — Download */}
          <div className="text-center mb-4">
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "var(--color-secondary-600)" }}>
              Option 1
            </p>
            <h2 className="font-serif text-2xl md:text-3xl font-semibold mb-5" style={{ color: "var(--color-primary-700)" }}>
              Print &amp; Bring It With You
            </h2>
            <a
              href="/assets/boys-who-cook-waiver.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary text-base px-8 py-3"
            >
              ⬇ Download the PDF
            </a>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 my-12">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">or</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Option 2 — Sign online */}
          <div className="text-center mb-8">
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "var(--color-secondary-600)" }}>
              Option 2
            </p>
            <h2 className="font-serif text-2xl md:text-3xl font-semibold" style={{ color: "var(--color-primary-700)" }}>
              Sign Electronically
            </h2>
          </div>

          {/* Native Netlify waiver form — centered, full width on mobile, ~750px on desktop */}
          <div className="mx-auto w-full max-w-[750px]">
            <WaiverForm />
          </div>
        </div>
      </section>
    </>
  );
}
