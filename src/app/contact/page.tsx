import { getContactPage, getSettings } from "@/lib/content";
import ContactForm from "@/components/ContactForm";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Contact" };

export default function ContactPage() {
  const contact = getContactPage();
  const settings = getSettings();
  const email = contact.email || settings.email;
  const phone = contact.phone || settings.phone;
  const address = contact.address || settings.address;

  return (
    <>
      <div className="page-header">
        <div className="max-w-2xl mx-auto">
          <h1 className="font-serif text-4xl md:text-5xl font-semibold mb-3">{contact.title}</h1>
          <p className="text-white/75">{contact.subtitle}</p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-14">
            {/* Info */}
            <div className="lg:col-span-2 space-y-5">
              <h2 className="font-serif text-2xl font-semibold" style={{ color: "var(--color-primary-700)" }}>Reach Out</h2>
              <p className="text-gray-500 text-sm leading-relaxed">
                Have a question, want to volunteer, or interested in partnering with us?
              </p>

              {email && (
                <ContactInfo icon="📧" label="Email">
                  <a href={`mailto:${email}`} className="hover:underline" style={{ color: "var(--color-primary-700)" }}>{email}</a>
                </ContactInfo>
              )}
              {phone && (
                <ContactInfo icon="📞" label="Phone">
                  <a href={`tel:${phone}`} className="hover:underline" style={{ color: "var(--color-primary-700)" }}>{phone}</a>
                </ContactInfo>
              )}
              {address && (
                <ContactInfo icon="📍" label="Address">
                  <span className="text-gray-600 whitespace-pre-line">{address}</span>
                </ContactInfo>
              )}

              {(settings.instagram || settings.facebook || settings.twitter) && (
                <div className="pt-2">
                  <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">Follow Us</p>
                  <div className="flex gap-2">
                    {settings.instagram && <SocialChip href={settings.instagram} label="Instagram" />}
                    {settings.facebook && <SocialChip href={settings.facebook} label="Facebook" />}
                    {settings.twitter && <SocialChip href={settings.twitter} label="Twitter" />}
                  </div>
                </div>
              )}
            </div>

            {/* Form */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <h2 className="font-semibold text-lg mb-6" style={{ color: "var(--color-primary-700)" }}>Send Us a Message</h2>
                <ContactForm successMessage={contact.success_message} />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function ContactInfo({ icon, label, children }: { icon: string; label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-4 p-4 rounded-xl border border-gray-100">
      <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 text-xl" style={{ background: "var(--color-primary-50)" }}>
        {icon}
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-0.5">{label}</p>
        <div className="text-sm">{children}</div>
      </div>
    </div>
  );
}

function SocialChip({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="px-4 py-1.5 text-xs font-medium rounded-full border transition-colors hover:text-white"
      style={{ borderColor: "var(--color-primary-300)", color: "var(--color-primary-700)" }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = "var(--color-primary-700)"; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = ""; }}
    >
      {label}
    </a>
  );
}
