import { getDonatePage } from "@/lib/content";
import { marked } from "marked";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Donate" };

export default function DonatePage() {
  const donate = getDonatePage();
  const whyHtml = marked.parse(donate.why_text || "");

  return (
    <>
      <div className="page-header">
        <div className="max-w-2xl mx-auto">
          <div className="text-4xl mb-3">💛</div>
          <h1 className="font-serif text-4xl md:text-5xl font-semibold mb-3">{donate.title}</h1>
          <p className="text-white/75 text-base max-w-lg mx-auto">{donate.subtitle}</p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div>
              <h2 className="font-serif text-2xl md:text-3xl font-semibold mb-6" style={{ color: "var(--color-primary-700)" }}>
                {donate.why_heading}
              </h2>
              <div className="prose prose-gray max-w-none text-gray-500 leading-relaxed mb-8" dangerouslySetInnerHTML={{ __html: whyHtml }} />
              {donate.button_link ? (
                <a href={donate.button_link} target="_blank" rel="noopener noreferrer" className="btn-primary text-base px-10 py-4">
                  💛 {donate.button_text}
                </a>
              ) : (
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-yellow-800 text-sm">
                  Set a donation link in Admin → Donate Page → Donate Button Link.
                </div>
              )}
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-sm uppercase tracking-widest mb-5" style={{ color: "var(--color-primary-700)" }}>
                Your Dollar Goes Far
              </h3>
              {donate.impact.map((item, i) => (
                <div key={i} className="flex items-center gap-4 p-5 rounded-xl border border-gray-100 hover:shadow-sm transition-shadow">
                  <div className="flex-shrink-0 w-16 h-16 rounded-xl flex items-center justify-center font-bold text-white text-sm" style={{ backgroundColor: "var(--color-primary-700)" }}>
                    {item.amount}
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-alt">
        <div className="container">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center max-w-2xl mx-auto">
            {[
              { icon: "🔒", title: "Secure Donation", desc: "Your payment is encrypted and secure" },
              { icon: "🧾", title: "Tax Deductible", desc: "We are a registered 501(c)(3) nonprofit" },
              { icon: "💯", title: "Direct Impact", desc: "100% of donations fund our programs" },
            ].map((t) => (
              <div key={t.title} className="p-5">
                <div className="text-3xl mb-3">{t.icon}</div>
                <h3 className="font-semibold text-sm mb-1" style={{ color: "var(--color-primary-700)" }}>{t.title}</h3>
                <p className="text-xs text-gray-500">{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
