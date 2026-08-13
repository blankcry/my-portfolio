import { useRef } from "react";
import HeroImage from "@/assets/heroImage.webp";
import NorthEast from "@/assets/north_east.svg";
import NorthEastBlack from "@/assets/north_east_black.svg";
import { Icon } from "@iconify/react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useSmoothScroll } from "@/components/scroll/SmoothScrollProvider";
import { useReveal } from "@/hooks/useReveal";

dayjs.extend(relativeTime);

/**
 * Trimmed to fit exactly one viewport, since sections now snap hard and must
 * not overflow. The four-bullet capability card that used to sit at the bottom
 * was dropped — it restated what the Services section already covers.
 *
 * The portrait here is its own plain, static image — independent of the hero
 * portrait in Home, which turns into the persistent nav button and doesn't
 * travel on to this section.
 */
function About() {
  const rootRef = useRef<HTMLElement>(null);
  const { scrollToSection, motionEnabled } = useSmoothScroll();
  const experienceInYears = dayjs("2020-01-01").toNow(true).split(" ")[0];
  useReveal(rootRef, { enabled: motionEnabled });

  return (
    <section
      id="about"
      ref={rootRef}
      className="flex section-vh w-full flex-col justify-center gap-4 overflow-hidden px-4 py-6 md:gap-6 md:px-16 md:py-10"
    >
      <div data-reveal className="flex flex-col gap-1">
        <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
          /About
        </span>
        <span className="text-2xl font-bold uppercase md:text-4xl">
          You can call me....
        </span>
      </div>

      <div className="flex min-h-0 flex-col items-center gap-4 md:flex-row md:gap-12">
        {/* ---- Identity ---- */}
        <div
          data-reveal
          className="flex w-full min-w-0 shrink-0 flex-col items-center gap-2 text-center font-ibm md:gap-3 md:w-auto"
        >
          <div className="rounded-full p-1 gradient">
            <div className="aspect-square w-[min(112px,15vh)] overflow-hidden rounded-full md:w-[min(200px,26vh)]">
              <img
                src={HeroImage}
                className="h-full w-full object-cover"
                alt="James Yunana - Full Stack Developer"
              />
            </div>
          </div>

          <p className="gradient-text text-3xl font-bold uppercase md:text-4xl">blankcry</p>
          <p className="flex flex-wrap items-center justify-center gap-x-2 text-sm md:text-base">
            <span className="font-extrabold italic">Full Stack Developer</span>
            <span>based in</span>
            <Icon
              icon="arcticons:emoji-flag-united-kingdom"
              fill="green"
              stroke="green"
              className="h-5 w-5"
            />
          </p>

          <div className="flex gap-3">
            {[
              { icon: "ic:round-facebook", href: "https://facebook.com/james-yunana", label: "Facebook" },
              { icon: "ri:twitter-x-line", href: "https://x.com/james_yuna", label: "X" },
              { icon: "ph:instagram-logo-thin", href: "https://instagram.com/james_yuna", label: "Instagram" },
            ].map((s) => (
              <a
                key={s.label}
                href={s.href}
                aria-label={s.label}
                className="transition-opacity hover:opacity-70"
              >
                <Icon icon={s.icon} width="20" height="20" />
              </a>
            ))}
          </div>

          <a
            href="https://docs.google.com/document/d/1P81SG_ILDA_xWMfAKbVF41KLqrmsuWcGYFdIqX0obsk/edit?usp=sharing"
            className="flex items-center gap-2 text-sm"
          >
            <span className="underline dark:decoration-white">Download CV</span>
            <img src={NorthEastBlack} alt="" width={16} height={16} />
          </a>
        </div>

        {/* ---- Narrative ---- */}
        <div className="flex w-full min-w-0 flex-col gap-3 md:gap-5">
          <p data-reveal className="text-sm text-gray-600 dark:text-gray-400 md:text-lg">
            I transform ideas into elegant, functional digital solutions. With expertise in
            both frontend and backend development, I create seamless web experiences that
            drive results.
          </p>

          <div data-reveal className="grid grid-cols-2 gap-x-3 gap-y-2 text-xs sm:gap-3 sm:text-sm">
            <span className="flex items-center gap-3">
              <Icon icon="el:phone-alt" width="18" height="18" />
              +234 704 101 8558
            </span>
            <span className="flex items-center gap-3">
              <Icon icon="iconamoon:profile-duotone" width="18" height="18" />
              {dayjs().from(dayjs("1998-10-04"), true)}
            </span>
            <span className="flex items-center gap-3">
              <Icon icon="mdi:email-box" width="18" height="18" />
              gajejames@outlook.com
            </span>
            <span className="flex items-center gap-3">
              <Icon icon="dashicons:location" width="16" height="16" />
              Derby, United Kingdom
            </span>
          </div>

          <hr className="h-[2px] w-full border-0 bg-black dark:bg-white" />

          {/* Stats are the first thing to go on small screens — the section is a
              hard viewport and the stacked mobile layout can't hold them. */}
          <div data-reveal className="hidden gap-6 sm:flex sm:flex-row">
            <div className="flex w-full flex-col gap-2">
              <p className="flex items-center gap-2 text-xs">
                <span className="gradient-text text-3xl font-bold uppercase md:text-4xl">
                  {experienceInYears}+
                </span>
                <span className="flex flex-col text-left font-bold italic">
                  Years <br />
                  experience...
                </span>
              </p>
              <p className="text-sm">
                Design-minded engineer shipping production software since 2020, across
                fintech and SaaS.
              </p>
            </div>
            <div className="flex w-full flex-col gap-2">
              <p className="flex items-center gap-2 text-xs">
                <span className="gradient-text text-3xl font-bold uppercase md:text-4xl">
                  10+
                </span>
                <span className="flex flex-col text-left font-bold italic">
                  Clients <br />
                  Worldwide...
                </span>
              </p>
              <p className="text-sm">
                The skills and knowledge to make your project a success, end to end.
              </p>
            </div>
          </div>

          <div data-reveal className="flex flex-col gap-3 sm:flex-row">
            <button
              className="btn-jump flex items-center justify-center gap-3 rounded-full bg-black px-6 py-3 text-sm font-medium text-white shadow-lg dark:bg-white dark:text-black"
              onClick={() => scrollToSection("experience")}
            >
              View My Experience
              <img src={NorthEast} alt="" className="h-4 w-4" />
            </button>
            <button
              className="rounded-full border-2 border-black px-6 py-3 text-sm font-medium transition-transform hover:scale-105 dark:border-white"
              onClick={() => scrollToSection("contacts")}
            >
              Let's Talk
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;
