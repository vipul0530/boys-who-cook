import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getSettings } from "@/lib/content";

export async function generateMetadata(): Promise<Metadata> {
  const settings = getSettings();
  return {
    title: {
      default: settings.site_name,
      template: `%s | ${settings.site_name}`,
    },
    description: settings.tagline,
    icons: { icon: "/favicon.ico" },
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = getSettings();

  return (
    <html lang="en" className={`theme-${settings.color_theme ?? "orange"}`}>
      <head>
        {/* Netlify Identity Widget — required for CMS admin login */}
        <script
          src="https://identity.netlify.com/v1/netlify-identity-widget.js"
          async
        />
      </head>
      <body className="flex flex-col min-h-screen">
        <Navbar
          siteName={settings.site_name}
          logo={settings.logo}
        />
        <main className="flex-1">{children}</main>
        <Footer settings={settings} />

        {/* Hidden Netlify forms — required for Netlify Forms detection at build time */}
        <form name="contact" data-netlify="true" hidden>
          <input name="name" type="text" />
          <input name="email" type="email" />
          <input name="subject" type="text" />
          <textarea name="message" />
        </form>

        <form name="waiver" data-netlify="true" netlify-honeypot="bot-field" hidden>
          <input name="bot-field" />
          <input name="participant_name" type="text" />
          <input name="date_of_birth" type="date" />
          <input name="parent_name" type="text" />
          <input name="parent_email" type="email" />
          <input name="workshop_name" type="text" />
          <input name="workshop_date" type="date" />
          <input name="facility" type="text" />
          <textarea name="allergies" />
          <input name="emergency_contact_name" type="text" />
          <input name="emergency_contact_phone" type="tel" />
          <input name="photo_opt_out" type="checkbox" />
          <input name="signature" type="text" />
          <input name="parent_printed_name" type="text" />
          <input name="participant_printed_name" type="text" />
          <input name="acknowledgment" type="checkbox" />
        </form>

        {/* Netlify Identity redirect script */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if (window.netlifyIdentity) {
                window.netlifyIdentity.on("init", user => {
                  if (!user) {
                    window.netlifyIdentity.on("login", () => {
                      document.location.href = "/admin/";
                    });
                  }
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
