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
 * icons, grouped 2 / 1 / 2 into pill segments. Works (the projects section)
 * sits alone in the middle, the most prominent slot.
 */
const GROUPS: SectionId[][] = [["about", "experience"], ["works"], ["services", "contacts"]];

/**
 * Mobile-only nav: three pill segments bridged by slim connectors so the
 * whole thing reads as one continuous bar that's merely pinched between
 * groups, not three disconnected islands. The current section's icon loses
 * its badge and switches to the segment's own contrast color — it never
 * pops out of its holder, only its color changes.
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
      className="fixed inset-x-6 bottom-5 z-50 flex items-center justify-center md:hidden"
    >
      {GROUPS.map((group, i) => (
        <div key={i} className="flex items-center">
          {i > 0 && <div className="h-1.5 w-5 shrink-0 bg-foreground" />}
          <div className="flex items-center gap-1 rounded-full bg-foreground p-1.5 shadow-2xl">
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
        </div>
      ))}
    </nav>
  );
}

export default MobileNav;
