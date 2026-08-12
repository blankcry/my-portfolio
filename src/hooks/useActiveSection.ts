import { ScrollTrigger, useGSAP } from "@/lib/gsap";
import { SECTION_IDS, type SectionId } from "@/lib/sections";

/**
 * Drives nav highlighting from ScrollTrigger instead of an IntersectionObserver.
 *
 * The old observer used `threshold: 0.5`, so sections shorter than half the
 * viewport never activated. A start/end pair around the 45% line is
 * height-agnostic: exactly one section is active at any scroll position, and it
 * re-measures itself on every `ScrollTrigger.refresh()`.
 */
export function useActiveSection(onChange: (id: SectionId) => void, enabled = true) {
  useGSAP(
    () => {
      if (!enabled) return;
      SECTION_IDS.forEach((id) => {
        if (!document.getElementById(id)) return;
        ScrollTrigger.create({
          trigger: `#${id}`,
          start: "top 45%",
          end: "bottom 45%",
          onToggle: (self) => {
            if (self.isActive) onChange(id);
          },
        });
      });
    },
    { dependencies: [enabled] }
  );
}
