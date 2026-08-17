import { CONTENT_DEFAULTS } from "@/lib/content";
import { SHOW_CBSE } from "@/lib/config";

// While affiliation approval is pending (SHOW_CBSE = false), these display
// strings are shown instead of their CBSE versions. content.json is untouched,
// so flipping SHOW_CBSE back to true restores everything.
const CBSE_OFF_OVERRIDES: Record<string, string> = {
  "hero.kicker": "Marikal, Telangana",
  "school.affiliation": "Marikal, Narayanpet",
  "hero.subtitle": "A bold, joyful school where children think for themselves, create fearlessly, and grow into the people the world needs.",
  "about.body1": "Founded in 2024, Oxford Grammar School is a school in Marikal, Narayanpet district — built on one belief: every child is extraordinary when someone truly believes in them.",
  "stats.s2.value": "N–8",
  "stats.s2.label": "Grades",
  "contact.mapUrl": "https://www.google.com/maps?q=Oxford+Grammar+School+Marikal+Narayanpet&output=embed",
};

export interface GalleryImage { id: string; title: string; category: string; url: string; sort: number }
export interface NewsItem {
  id: string; title: string; slug: string; excerpt: string; body: string;
  coverUrl: string | null; category: string; published: boolean; date: string;
}
export interface BoardResult {
  id: string; year: string; classLevel: string; appeared: number; passed: number;
  passPercent: number; topperName: string | null; topperScore: string | null; sort: number;
}
export interface FacultyMember {
  name: string; designation: string; qualification: string; subject: string;
  photoUrl: string | null; sort: number;
}
export interface DisclosureDoc { label: string; fileUrl: string | null; note: string; sort: number }

export interface Content {
  settings: Record<string, string>;
  gallery: GalleryImage[];
  news: NewsItem[];
  results: BoardResult[];
  faculty: FacultyMember[];
  disclosureDocs: DisclosureDoc[];
}

/** Everything a page needs, derived from a content object. */
export interface SiteData {
  content: Record<string, string>;
  gallery: GalleryImage[];
  news: NewsItem[];
  results: BoardResult[];
  faculty: FacultyMember[];
  disclosureDocs: DisclosureDoc[];
  newsBySlug: (slug: string) => NewsItem | undefined;
  resultsByClass: (cls: string) => BoardResult[];
}

export function selectSite(c: Content): SiteData {
  const content: Record<string, string> = { ...CONTENT_DEFAULTS };
  for (const [k, v] of Object.entries(c.settings || {})) if (v !== "") content[k] = v;
  if (!SHOW_CBSE) Object.assign(content, CBSE_OFF_OVERRIDES);

  const gallery = [...(c.gallery || [])].sort((a, b) => a.sort - b.sort);
  const news = [...(c.news || [])]
    .filter((n) => n.published)
    .sort((a, b) => +new Date(b.date) - +new Date(a.date));
  const results = [...(c.results || [])].sort((a, b) =>
    a.classLevel === b.classLevel ? a.sort - b.sort : a.classLevel.localeCompare(b.classLevel)
  );
  const faculty = [...(c.faculty || [])].sort((a, b) => a.sort - b.sort);
  const disclosureDocs = [...(c.disclosureDocs || [])].sort((a, b) => a.sort - b.sort);

  return {
    content, gallery, news, results, faculty, disclosureDocs,
    newsBySlug: (slug) => news.find((n) => n.slug === slug),
    resultsByClass: (cls) => results.filter((r) => r.classLevel === cls),
  };
}
