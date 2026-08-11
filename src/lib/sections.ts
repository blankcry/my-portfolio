/**
 * The page is one long document of stacked sections; these ids are the anchors
 * that navigation, snapping and active-section tracking all key off.
 * Order here is the order they appear in `App.tsx`.
 */
export const SECTION_IDS = [
  "home",
  "about",
  "experience",
  "services",
  "works",
  "contacts",
  "blogs",
] as const;

export type SectionId = (typeof SECTION_IDS)[number];

export const NAV_ITEMS: { title: string; href: SectionId }[] = [
  { title: "Home", href: "home" },
  { title: "About", href: "about" },
  { title: "Experience", href: "experience" },
  { title: "Services", href: "services" },
  { title: "Works", href: "works" },
  { title: "Contacts", href: "contacts" },
  { title: "Blogs", href: "blogs" },
];

/** Shared easing — easeOutExpo. Used by Lenis, snapping and click-nav alike. */
export const SCROLL_EASE = (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t));
