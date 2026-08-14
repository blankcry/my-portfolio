import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import { useSmoothScroll } from "@/components/scroll/SmoothScrollProvider";
import { useNavActiveState } from "@/hooks/useNavActiveState";
import type { SectionId } from "@/lib/sections";

const SECTION_ICONS: Record<SectionId, string> = {
  home: "carbon:home",
  about: "carbon:user",
  experience: "carbon:timeline",
  services: "carbon:tool-kit",
  works: "carbon:apps",
  contacts: "carbon:email",
  blogs: "carbon:blog",
};

/**
 * Home is reachable via the logo, Blogs via scroll — the bar stays to five
 * icons, grouped 2 / 1 / 2 into separate pill segments so the gaps between
 * groups read as deliberate segmentation rather than one solid bar.
 */
const GROUPS: SectionId[][] = [["about", "experience"], ["services"], ["works", "contacts"]];

/**
 * Mobile-only nav: three floating pill segments. The current section's icon
 * loses its badge and switches to the segment's own contrast color — it
 * never pops out of its holder, only its color changes.
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
      className="fixed inset-x-6 bottom-5 z-50 flex items-center justify-center gap-3 md:hidden"
    >
      {GROUPS.map((group, i) => (
        <div
          key={i}
          className="flex items-center gap-1 rounded-full bg-foreground p-1.5 shadow-2xl"
        >
          {group.map((href) => {
            const active = isActive(href);
            const title = href.charAt(0).toUpperCase() + href.slice(1);
            return (
              <button
                key={href}
                onClick={() => goTo(href)}
                aria-label={title}
                aria-current={active ? "true" : undefined}
                className={
                  "flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition-colors duration-300 ease-out " +
                  (active ? "bg-transparent text-background" : "bg-background text-foreground/70")
                }
              >
                <Icon icon={SECTION_ICONS[href]} width={20} height={20} />
              </button>
            );
          })}
        </div>
      ))}
    </nav>
  );
}

export default MobileNav;
