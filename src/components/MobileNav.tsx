import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import { useSmoothScroll } from "@/components/scroll/SmoothScrollProvider";
import { useNavActiveState } from "@/hooks/useNavActiveState";
import { NAV_ITEMS, type SectionId } from "@/lib/sections";

const SECTION_ICONS: Record<SectionId, string> = {
  home: "carbon:home",
  about: "carbon:user",
  experience: "carbon:timeline",
  services: "carbon:tool-kit",
  works: "carbon:apps",
  contacts: "carbon:email",
  blogs: "carbon:blog",
};

/** Home is reachable via the logo, Blogs via scroll — the bar stays to five icons. */
const MOBILE_HREFS: SectionId[] = ["about", "experience", "services", "works", "contacts"];
const MOBILE_ITEMS = NAV_ITEMS.filter((item) => MOBILE_HREFS.includes(item.href));

/**
 * Mobile-only nav: a floating pill of icon buttons. The current section's
 * icon blends into the bar and pushes up above it as a filled blob — same
 * fill as the bar itself, so only the raised silhouette reads as "selected."
 */
export function MobileNav() {
  const { scrollToSection } = useSmoothScroll();
  const { isHome, isActive } = useNavActiveState();
  const navigate = useNavigate();

  const goTo = (id: SectionId) => {
    if (isHome) scrollToSection(id);
    else navigate(`/#${id}`);
  };

  return (
    <nav
      aria-label="Section navigation"
      className="fixed inset-x-6 bottom-5 z-50 flex h-16 items-center justify-around overflow-visible rounded-full bg-foreground px-2 shadow-2xl md:hidden"
    >
      {MOBILE_ITEMS.map((item) => {
        const active = isActive(item.href);
        return (
          <button
            key={item.href}
            onClick={() => goTo(item.href)}
            aria-label={item.title}
            aria-current={active ? "true" : undefined}
            className={
              "flex shrink-0 items-center justify-center rounded-full transition-all duration-300 ease-out " +
              (active
                ? "-mt-7 h-14 w-14 bg-foreground text-background shadow-lg"
                : "-mt-2 h-11 w-11 bg-background text-foreground/70")
            }
          >
            <Icon icon={SECTION_ICONS[item.href]} width={active ? 24 : 18} height={active ? 24 : 18} />
          </button>
        );
      })}
    </nav>
  );
}

export default MobileNav;
