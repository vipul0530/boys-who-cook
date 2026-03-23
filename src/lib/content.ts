import fs from "fs";
import path from "path";
import matter from "gray-matter";

const contentDir = path.join(process.cwd(), "content");

// ─── Types ───────────────────────────────────────────────────────────────────

export interface SiteSettings {
  site_name: string;
  tagline: string;
  logo: string;
  email: string;
  phone: string;
  address: string;
  facebook: string;
  instagram: string;
  twitter: string;
  youtube: string;
  donate_link: string;
  footer_text: string;
  color_theme?: string;
}

export interface HomePageData {
  hero: {
    heading: string;
    subheading: string;
    description?: string;
    image: string;
    cta_text: string;
    cta_link: string;
    cta_secondary_text?: string;
    cta_secondary_link?: string;
  };
  quotes: Array<{ source: string; role?: string; text: string }>;
  mission: {
    heading: string;
    text: string;
    image: string;
  };
  stats: Array<{ number: string; label: string }>;
  programs_section: { heading: string; subheading?: string };
  cta_section: {
    heading: string;
    text: string;
    button_text: string;
    button_link: string;
  };
}

export interface AboutPageData {
  title: string;
  subtitle: string;
  story: { heading: string; text: string; image: string };
  mission_vision: {
    mission_heading: string;
    mission_text: string;
    vision_heading: string;
    vision_text: string;
  };
  values: Array<{ title: string; description: string; icon: string }>;
}

export interface DonatePageData {
  title: string;
  subtitle: string;
  image: string;
  why_heading: string;
  why_text: string;
  impact: Array<{ amount: string; description: string }>;
  button_text: string;
  button_link: string;
}

export interface ContactPageData {
  title: string;
  subtitle: string;
  email: string;
  phone: string;
  address: string;
  success_message: string;
}

export interface Program {
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  body: string;
  order: number;
  active: boolean;
}

export interface Event {
  slug: string;
  title: string;
  date: string;
  end_date?: string;
  location: string;
  image: string;
  excerpt: string;
  body: string;
  registration_link?: string;
}

export interface TeamMember {
  slug: string;
  title: string;
  role: string;
  photo: string;
  bio: string;
  order: number;
}

export interface GalleryItem {
  slug: string;
  title: string;
  image: string;
  order: number;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function readJson<T>(filePath: string): T {
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw) as T;
}

function readMarkdownDir(folder: string): Record<string, unknown>[] {
  const dir = path.join(contentDir, folder);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .map((filename) => {
      const raw = fs.readFileSync(path.join(dir, filename), "utf-8");
      const { data, content } = matter(raw);
      return { slug: filename.replace(/\.md$/, ""), ...data, body: content } as Record<string, unknown>;
    });
}

// ─── Public API ──────────────────────────────────────────────────────────────

export function getSettings(): SiteSettings {
  return readJson<SiteSettings>(path.join(contentDir, "settings.json"));
}

export function getHomePage(): HomePageData {
  return readJson<HomePageData>(path.join(contentDir, "pages/home.json"));
}

export function getAboutPage(): AboutPageData {
  return readJson<AboutPageData>(path.join(contentDir, "pages/about.json"));
}

export function getDonatePage(): DonatePageData {
  return readJson<DonatePageData>(path.join(contentDir, "pages/donate.json"));
}

export function getContactPage(): ContactPageData {
  return readJson<ContactPageData>(path.join(contentDir, "pages/contact.json"));
}

export function getPrograms(): Program[] {
  const items = readMarkdownDir("programs") as unknown as Program[];
  return items
    .filter((p) => p.active !== false)
    .sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
}

export function getEvents(): Event[] {
  const items = readMarkdownDir("events") as unknown as Event[];
  return items.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function getUpcomingEvents(): Event[] {
  const now = new Date();
  return getEvents().filter((e) => new Date(e.date) >= now);
}

export function getPastEvents(): Event[] {
  const now = new Date();
  return getEvents().filter((e) => new Date(e.date) < now);
}

export function getTeamMembers(): TeamMember[] {
  const items = readMarkdownDir("team") as unknown as TeamMember[];
  return items.sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
}

export function getGallery(): GalleryItem[] {
  const items = readMarkdownDir("gallery") as unknown as GalleryItem[];
  return items
    .filter((g) => g.image)
    .sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
}
