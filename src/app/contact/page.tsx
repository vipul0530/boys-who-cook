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
      {/* Page Header */}
      <div className="page-header">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold font-heading mb-4">
            {contact.title}
          </h1>
          <p className="text-white/85 text-lg">{contact.subtitle}</p>
        </div>
      </div>

      {/* Contact Section */}
      <section className="section">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            {/* Contact Info */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h2 className="text-2xl font-bold font-heading text-gray-900 mb-6">
                  Reach Out
                </h2>
                <p className="text-gray-600 leading-relaxed mb-6">
                  Have a question, want to volunteer, or interested in partnering with us? We&apos;d love to hear from you!
                </p>
              </div>

              {/* Info Cards */}
              <div className="space-y-4">
                {email && (
                  <div className="flex items-start gap-4 p-4 rounded-2xl bg-orange-50 border border-orange-100">
                    <div className="w-12 h-12 bg-primary-600 rounded-xl flex items-center justify-center text-xl flex-shrink-0">
                      📧
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-0.5">
                        Email
                      </div>
                      <a
                        href={`mailto:${email}`}
                        className="text-primary-600 hover:text-primary-800 font-medium transition-colors"
                      >
                        {email}
                      </a>
                    </div>
                  </div>
                )}

                {phone && (
                  <div className="flex items-start gap-4 p-4 rounded-2xl bg-orange-50 border border-orange-100">
                    <div className="w-12 h-12 bg-primary-600 rounded-xl flex items-center justify-center text-xl flex-shrink-0">
                      📞
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-0.5">
                        Phone
                      </div>
                      <a
                        href={`tel:${phone}`}
                        className="text-primary-600 hover:text-primary-800 font-medium transition-colors"
                      >
                        {phone}
                      </a>
                    </div>
                  </div>
                )}

                {address && (
                  <div className="flex items-start gap-4 p-4 rounded-2xl bg-orange-50 border border-orange-100">
                    <div className="w-12 h-12 bg-primary-600 rounded-xl flex items-center justify-center text-xl flex-shrink-0">
                      📍
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-0.5">
                        Address
                      </div>
                      <p className="text-gray-700 whitespace-pre-line">{address}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Social Links */}
              {(settings.instagram || settings.facebook || settings.twitter) && (
                <div className="pt-2">
                  <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                    Follow Us
                  </p>
                  <div className="flex gap-3">
                    {settings.instagram && (
                      <a
                        href={settings.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 bg-gray-100 hover:bg-primary-100 rounded-xl flex items-center justify-center transition-colors text-gray-600 hover:text-primary-600"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                        </svg>
                      </a>
                    )}
                    {settings.facebook && (
                      <a
                        href={settings.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 bg-gray-100 hover:bg-primary-100 rounded-xl flex items-center justify-center transition-colors text-gray-600 hover:text-primary-600"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                      </a>
                    )}
                    {settings.twitter && (
                      <a
                        href={settings.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 bg-gray-100 hover:bg-primary-100 rounded-xl flex items-center justify-center transition-colors text-gray-600 hover:text-primary-600"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                        </svg>
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-3xl shadow-lg p-8 border border-gray-100">
                <h2 className="text-xl font-bold font-heading text-gray-900 mb-6">
                  Send Us a Message
                </h2>
                <ContactForm successMessage={contact.success_message} />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
