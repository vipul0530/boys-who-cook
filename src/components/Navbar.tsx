"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

interface NavbarProps {
  siteName: string;
  logo?: string;
  donateLink?: string;
}

const navLinks = [
  { href: "/",         label: "Home" },
  { href: "/about",    label: "About" },
  { href: "/programs", label: "Programs" },
  { href: "/events",   label: "Events" },
  { href: "/gallery",  label: "Gallery" },
  { href: "/team",     label: "Team" },
  { href: "/contact",  label: "Contact" },
];

export default function Navbar({ siteName, logo, donateLink }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  // Ignore local file:// paths (e.g. if someone pasted one in the CMS)
  const validLogo =
    logo && !logo.startsWith("file://") ? logo : null;

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="flex items-center justify-between h-20">

          {/* ── Logo & Site Name ─────────────────────────────────────── */}
          <Link href="/" className="flex items-center gap-3 flex-shrink-0">
            {validLogo ? (
              <Image
                src={validLogo}
                alt={siteName}
                width={52}
                height={52}
                className="h-12 w-12 object-contain"
              />
            ) : (
              /* Fallback chef-hat placeholder while logo loads */
              <div className="w-12 h-12 rounded-full bg-primary-50 flex items-center justify-center text-2xl border border-primary-100">
                👨‍🍳
              </div>
            )}
            <span
              className="font-bold text-lg leading-tight"
              style={{ color: "var(--color-primary-700)" }}
            >
              {siteName}
            </span>
          </Link>

          {/* ── Desktop Nav Links ────────────────────────────────────── */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive(link.href)
                    ? "font-semibold"
                    : "text-gray-600 hover:text-gray-900"
                }`}
                style={
                  isActive(link.href)
                    ? { color: "var(--color-primary-700)" }
                    : {}
                }
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* ── Donate + Mobile Toggle ───────────────────────────────── */}
          <div className="flex items-center gap-3">
            {/* Donate button */}
            {donateLink ? (
              <a
                href={donateLink}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden md:inline-flex btn-primary text-sm py-2 px-5"
              >
                Donate
              </a>
            ) : (
              <Link
                href="/donate"
                className="hidden md:inline-flex btn-primary text-sm py-2 px-5"
              >
                Donate
              </Link>
            )}

            {/* Mobile hamburger */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 rounded-md text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-colors"
              aria-label="Toggle menu"
            >
              {menuOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile Menu ──────────────────────────────────────────────── */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white">
          <div className="px-5 py-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive(link.href)
                    ? "bg-primary-50 font-semibold"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
                style={isActive(link.href) ? { color: "var(--color-primary-700)" } : {}}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-2">
              {donateLink ? (
                <a
                  href={donateLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center btn-primary"
                >
                  Donate
                </a>
              ) : (
                <Link
                  href="/donate"
                  onClick={() => setMenuOpen(false)}
                  className="block w-full text-center btn-primary"
                >
                  Donate
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
