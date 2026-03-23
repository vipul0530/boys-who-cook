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
    <html lang="en">
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
          donateLink={settings.donate_link}
        />
        <main className="flex-1">{children}</main>
        <Footer settings={settings} />

        {/* Hidden Netlify form — required for Netlify Forms detection at build time */}
        <form name="contact" data-netlify="true" hidden>
          <input name="name" type="text" />
          <input name="email" type="email" />
          <input name="subject" type="text" />
          <textarea name="message" />
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
