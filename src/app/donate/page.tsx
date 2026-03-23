import Image from "next/image";
import { getDonatePage } from "@/lib/content";
import { marked } from "marked";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Donate" };

export default function DonatePage() {
  const donate = getDonatePage();
  const whyHtml = marked.parse(donate.why_text || "");

  return (
    <>
      {/* Page Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-amber-500 via-primary-600 to-primary-800 text-white py-20 px-4 text-center">
        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="text-5xl mb-4">💛</div>
          <h1 className="text-4xl md:text-5xl font-bold font-heading mb-4">
            {donate.title}
          </h1>
          <p className="text-white/85 text-lg max-w-xl mx-auto">{donate.subtitle}</p>
        </div>
      </div>

      {/* Why Donate */}
      <section className="section">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold font-heading text-gray-900 mb-6">
                {donate.why_heading}
              </h2>
              <div
                className="prose prose-gray max-w-none text-gray-600 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: whyHtml }}
              />

              {/* Donate Button */}
              <div className="mt-8">
                {donate.button_link ? (
                  <a
                    href={donate.button_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary text-lg px-10 py-4"
                  >
                    💛 {donate.button_text}
                  </a>
                ) : (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-yellow-800 text-sm">
                    <strong>Admin note:</strong> Set a donation link in the Admin panel under{" "}
                    <em>Donate Page → Donate Button Link</em>.
                  </div>
                )}
              </div>
            </div>

            {/* Impact Cards */}
            <div>
              <h3 className="text-xl font-bold font-heading text-gray-900 mb-5">
                Your Dollar Goes Far
              </h3>
              <div className="space-y-4">
                {donate.impact.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-4 p-5 rounded-2xl bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-100"
                  >
                    <div className="flex-shrink-0 w-16 h-16 bg-primary-600 text-white rounded-2xl flex items-center justify-center font-bold font-heading text-lg">
                      {item.amount}
                    </div>
                    <div className="flex-1 pt-1">
                      <p className="text-gray-700 leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust signals */}
      <section className="section-alt">
        <div className="container">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center max-w-3xl mx-auto">
            <div className="p-6">
              <div className="text-4xl mb-3">🔒</div>
              <h3 className="font-bold text-gray-900 mb-1">Secure Donation</h3>
              <p className="text-sm text-gray-500">Your payment is encrypted and secure</p>
            </div>
            <div className="p-6">
              <div className="text-4xl mb-3">🧾</div>
              <h3 className="font-bold text-gray-900 mb-1">Tax Deductible</h3>
              <p className="text-sm text-gray-500">We are a registered 501(c)(3) nonprofit</p>
            </div>
            <div className="p-6">
              <div className="text-4xl mb-3">💯</div>
              <h3 className="font-bold text-gray-900 mb-1">Direct Impact</h3>
              <p className="text-sm text-gray-500">100% of donations fund our programs</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
