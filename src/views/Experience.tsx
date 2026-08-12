import { useEffect, useRef, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@iconify/react";
import { useExperience } from "@/hooks/useExperience";
import { useCanHover } from "@/hooks/useCanHover";
import { useHoverIntent } from "@/hooks/useHoverIntent";
import { ExperienceItemSkeleton } from "@/components/ExperienceItemSkeleton";
import { CompanyLogo } from "@/components/experience/CompanyLogo";
import { LogoMarquee } from "@/components/experience/LogoMarquee";
import { ScrollAffordance } from "@/components/experience/ScrollAffordance";
import { useReveal } from "@/hooks/useReveal";
import { useSmoothScroll } from "@/components/scroll/SmoothScrollProvider";
import { gsap, useGSAP } from "@/lib/gsap";

function Experience() {
  const { experience, loading, error } = useExperience();
  const { requestRefresh, motionEnabled } = useSmoothScroll();
  const canHover = useCanHover();

  /** Which panel is expanded. Also set by click/keyboard, so hover is additive. */
  const [openId, setOpenId] = useState<string | undefined>(undefined);
  /** Which company the left-hand card is showing. Follows hover *and* focus. */
  const [focusId, setFocusId] = useState<string | undefined>(undefined);

  const rootRef = useRef<HTMLDivElement>(null);
  const bioRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const crossfade = useRef<gsap.core.Timeline | null>(null);

  // Re-runs when the rows land, so the accordion column isn't revealed while
  // it is still a stack of skeletons.
  useReveal(rootRef, { enabled: motionEnabled, dependencies: [loading] });

  const focused = experience.find((e) => e.id === focusId);

  const { handleEnter, handleLeave } = useHoverIntent<string>(
    (id) => {
      setOpenId(id);
      setFocusId(id);
    },
    () => {
      setOpenId(undefined);
      setFocusId(undefined);
    },
    { enabled: canHover }
  );

  // Swapping skeletons for real rows changes document height, which invalidates
  // every ScrollTrigger start/end below this point.
  useEffect(() => {
    if (!loading) requestRefresh();
  }, [loading, experience.length, requestRefresh]);

  // Crossfade the bio out and the company card in. One persistent card node
  // whose *contents* swap, so switching companies never unmounts mid-tween.
  useGSAP(
    () => {
      if (!motionEnabled || !bioRef.current || !cardRef.current) return;
      crossfade.current?.kill();
      crossfade.current = gsap
        .timeline({ overwrite: "auto" })
        .to(
          bioRef.current,
          { autoAlpha: focusId ? 0 : 1, y: focusId ? -12 : 0, duration: 0.3 },
          0
        )
        .fromTo(
          cardRef.current,
          { autoAlpha: 0, y: 16, scale: 0.97 },
          { autoAlpha: focusId ? 1 : 0, y: 0, scale: 1, duration: 0.4, ease: "power3.out" },
          0.08
        );
    },
    { dependencies: [focusId, motionEnabled], scope: rootRef }
  );

  // Stagger the bullet list whenever a panel opens.
  useGSAP(
    () => {
      if (!motionEnabled || !openId) return;
      gsap.from('[data-state="open"] [data-desc-line]', {
        y: 8,
        autoAlpha: 0,
        stagger: 0.04,
        duration: 0.3,
      });
    },
    { dependencies: [openId, motionEnabled], scope: rootRef }
  );

  const selectFromMarquee = (id: string) => {
    setOpenId(id);
    setFocusId(id);
    listRef.current
      ?.querySelector(`[data-exp-item="${id}"]`)
      ?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  };

  return (
    <section
      id="experience"
      ref={rootRef}
      className="flex section-vh w-full flex-col overflow-hidden"
    >
      <div className="flex h-full w-full flex-col gap-4 px-4 py-6 md:gap-6 md:px-16 md:py-10">
        <div data-reveal className="flex flex-col gap-1">
          <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
            /Experience
          </span>
          <span className="text-2xl font-bold uppercase md:text-4xl">Where I've built</span>
        </div>

        <div className="flex min-h-0 flex-1 flex-col justify-between gap-6 md:flex-row md:gap-16">
          {/* ---- Left: bio, replaced by the hovered company's card ---- */}
          <div className="flex w-full min-w-0 flex-col gap-3 font-ibm md:w-[50%]">
            <div data-reveal className="relative hidden min-h-[260px] flex-1 md:block">
              <div ref={bioRef} className="absolute inset-0 text-sm md:text-base">
                I'm a full stack developer working mainly in JavaScript across
                backend and frontend, with Python for backend services. I've built
                and shipped production fintech and SaaS applications serving
                millions of users, including payment collection and disbursement
                integrations that keep manual work to a minimum. Along the way I've
                worn most of the hats — project management, database
                administration, and untangling legacy systems.
              </div>

              <div
                ref={cardRef}
                aria-hidden={!focused}
                className="absolute inset-0 flex flex-col gap-4 rounded-2xl border border-black/10 bg-black/[0.04] p-6 opacity-0 backdrop-blur-sm dark:border-white/15 dark:bg-white/[0.06]"
              >
                {focused && (
                  <>
                    <CompanyLogo
                      company={focused.company}
                      logoUrl={focused.logo_url}
                      size={112}
                    />
                    <div className="flex flex-col gap-1">
                      <span className="text-2xl md:text-3xl font-extrabold">
                        {focused.company}
                      </span>
                      <span className="text-sm md:text-base opacity-90">
                        {focused.position}
                      </span>
                      <span className="text-xs uppercase tracking-widest opacity-70">
                        {focused.start_date} — {focused.end_date ?? "Present"}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {focused.skills?.slice(0, 5).map((skill) => (
                        <Badge key={skill} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* ---- Right: the accordion ---- */}
          <div
            data-reveal
            className="relative flex min-h-0 w-full min-w-0 flex-1 md:w-[50%] md:flex-none"
          >
          <div
            ref={listRef}
            data-lenis-prevent
            className="min-h-0 w-full min-w-0 flex-1 overflow-y-auto pr-10 md:pr-12"
            style={{
              // Fixed height means opening a panel never changes document
              // height — no ScrollTrigger refresh, no jump mid-hover. The
              // section is now exactly one viewport, so this list absorbs the
              // remaining space rather than growing the page.
              maskImage:
                "linear-gradient(to bottom, transparent, black 4%, black 96%, transparent)",
              WebkitMaskImage:
                "linear-gradient(to bottom, transparent, black 4%, black 96%, transparent)",
            }}
          >
            <Accordion
              type="single"
              collapsible
              value={openId ?? ""}
              onValueChange={(v) => {
                setOpenId(v || undefined);
                setFocusId(v || undefined);
              }}
            >
              {loading &&
                Array.from({ length: 5 }).map((_, i) => <ExperienceItemSkeleton key={i} />)}
              {error && <p>Error fetching experience: {error}</p>}
              {!loading &&
                !error &&
                experience.map((exp) => (
                  <AccordionItem
                    value={exp.id}
                    key={exp.id}
                    data-exp-item={exp.id}
                    // On the wrapper, not the trigger: otherwise moving into the
                    // expanded content counts as a leave and collapses it.
                    onMouseEnter={() => handleEnter(exp.id)}
                    onMouseLeave={handleLeave}
                    // Tab focus moves the left card without forcing the panel
                    // open — forcing it would break Radix's toggle on Enter.
                    onFocus={() => setFocusId(exp.id)}
                  >
                    <AccordionTrigger className="justify-end gap-2 bg-transparent">
                      <div className="flex w-full items-center gap-3">
                        <CompanyLogo
                          company={exp.company}
                          logoUrl={exp.logo_url}
                          size={40}
                          className="md:hidden"
                        />
                        <div className="flex flex-col gap-2 w-full">
                          <div className="flex flex-col md:flex-row justify-between w-full text-sm md:text-base">
                            <span>
                              {exp.start_date} - {exp.end_date ?? "Present"}
                            </span>
                            <span>{exp.company}</span>
                          </div>
                          <span className="text-sm md:text-base">{exp.position}</span>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="w-full flex flex-col gap-2 font-ibm">
                        {exp.desc?.map((item, i) => (
                          <span
                            key={i}
                            data-desc-line
                            className="flex gap-2 text-sm md:text-base"
                          >
                            <Icon
                              icon="line-md:check-all"
                              width="20"
                              height="20"
                              className="md:w-6 md:h-6 shrink-0"
                              inline
                            />
                            {item}
                          </span>
                        ))}
                        {exp.skills?.length > 0 && (
                          <span data-desc-line className="italic text-sm md:text-base">
                            <span className="font-semibold">Skills:</span>{" "}
                            {exp.skills.join(", ")}
                          </span>
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
            </Accordion>
          </div>

            {!loading && !error && (
              <ScrollAffordance
                targetRef={listRef}
                className="absolute inset-y-2 right-0 z-10"
              />
            )}
          </div>
        </div>

        {!loading && !error && (
          <div className="shrink-0">
            <LogoMarquee
              items={experience}
              motionEnabled={motionEnabled}
              onSelect={selectFromMarquee}
            />
          </div>
        )}
      </div>
    </section>
  );
}

export default Experience;
