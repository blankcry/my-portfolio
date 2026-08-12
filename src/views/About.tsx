import HeroImage from "@/assets/heroImage.webp";
import NorthEast from "@/assets/north_east.svg";
import NorthEastBlack from "@/assets/north_east_black.svg";
import { Icon } from "@iconify/react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useSmoothScroll } from "@/components/scroll/SmoothScrollProvider";
import { useReveal } from "@/hooks/useReveal";
import { useRef } from "react";

dayjs.extend(relativeTime);

function About() {
  const rootRef = useRef<HTMLElement>(null);
  const { scrollToSection, motionEnabled } = useSmoothScroll();
  const experienceInYears = dayjs("2020-01-01").toNow(true).split(" ")[0];
  useReveal(rootRef, { enabled: motionEnabled });

  return (
    <section id="about" ref={rootRef} className="w-full flex flex-col gap-8 min-h-[100dvh]">
      <div
        id="Heading"
        className="flex flex-col gap-4 w-full text-left px-4 md:px-24 py-8 md:py-12 pb-0"
      >
        <span data-reveal className="capitalize italic text-base md:text-lg font-semibold">
          nice to meet you!
        </span>
        <span data-reveal className="uppercase font-bold text-3xl md:text-4xl">
          you can call me....
        </span>
      </div>

      <div className="flex flex-col md:flex-row justify-evenly gap-8 md:gap-12 w-full px-4 md:px-24 pb-12">
        {/* ---- Identity column ---- */}
        <div className="flex flex-col gap-4 w-full min-w-0 text-center items-center font-ibm">
          {/*
           * Landing pad for the portrait scrubbed down from Home. The gradient
           * ring stays; the image inside is owned by HeroPortraitLayer, which
           * reveals this static copy once the scrub completes.
           */}
          <div className="relative p-1 rounded-full gradient">
            <div
              data-hero-slot="about"
              className="w-[min(280px,38vh)] md:w-[min(400px,30vw,52vh)] aspect-square rounded-full overflow-hidden"
            >
              <img
                data-hero-resting
                src={HeroImage}
                className={`w-full h-full object-cover ${motionEnabled ? "opacity-0" : ""}`}
                alt="James Yunana - Full Stack Developer"
              />
            </div>
          </div>

          <div>
            <p className="gradient-text uppercase font-bold text-4xl md:text-5xl">
              blankcry
            </p>
            <p className="text-base md:text-lg flex flex-wrap gap-x-2 justify-center items-center">
              <span className="font-extrabold italic">Full Stack Developer</span>
              <span>based in</span>
              <Icon
                icon="arcticons:emoji-flag-united-kingdom"
                fill="green"
                stroke="green"
                className="w-6 h-6"
              />
              <span>— with an eye for detail</span>
            </p>
          </div>

          <div className="flex flex-col gap-4 items-center">
            <hr className="w-[120px] h-[2px] border-0 bg-black dark:bg-white" />
            <div className="flex gap-4">
              <a
                href="https://facebook.com/james-yunana"
                aria-label="Facebook"
                className="hover:opacity-80 transition-opacity hover:scale-110"
              >
                <Icon icon="ic:round-facebook" width="24" height="24" />
              </a>
              <a
                href="https://x.com/james_yuna"
                aria-label="X"
                className="hover:opacity-80 transition-opacity hover:scale-110"
              >
                <Icon icon="ri:twitter-x-line" width="24" height="24" />
              </a>
              <a
                href="https://instagram.com/james_yuna"
                aria-label="Instagram"
                className="hover:opacity-80 transition-opacity hover:scale-110"
              >
                <Icon icon="ph:instagram-logo-thin" width="24" height="24" />
              </a>
            </div>
          </div>

          <a
            href="https://docs.google.com/document/d/1P81SG_ILDA_xWMfAKbVF41KLqrmsuWcGYFdIqX0obsk/edit?usp=sharing"
            className="flex gap-4 items-center"
          >
            <span className="underline dark:decoration-white">Download CV</span>
            <img src={NorthEastBlack} alt="" width={20} height={20} />
          </a>
        </div>

        {/* ---- Narrative column: story → facts → proof → action ---- */}
        <div className="flex flex-col w-full min-w-0 gap-8">
          <p className="text-base md:text-lg text-gray-600 dark:text-gray-400">
            I transform ideas into elegant, functional digital solutions. With
            expertise in both frontend and backend development, I create seamless
            web experiences that drive results.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <span className="flex gap-3 items-center text-sm md:text-base">
              <Icon icon="el:phone-alt" width="20" height="20" className="md:w-6 md:h-6" />
              +234 704 101 8558
            </span>
            <span className="flex gap-3 items-center text-sm md:text-base">
              <Icon
                icon="iconamoon:profile-duotone"
                width="20"
                height="20"
                className="md:w-6 md:h-6"
              />
              {dayjs().from(dayjs("1998-10-04"), true)}
            </span>
            <span className="flex gap-3 items-center text-sm md:text-base">
              <Icon icon="mdi:email-box" width="20" height="20" className="md:w-6 md:h-6" />
              <span>gajejames@outlook.com</span>
            </span>
            <span className="flex gap-3 items-center text-sm md:text-base">
              <Icon icon="dashicons:location" width="18" height="18" className="md:w-5 md:h-5" />
              <span>Derby, United Kingdom</span>
            </span>
          </div>

          <hr className="border-0 bg-black dark:bg-white h-[2px] w-full" />

          <div className="flex flex-col md:flex-row justify-between gap-8 md:gap-4">
            {/* Years Experience */}
            <div className="flex flex-col gap-4 w-full md:w-[50%]">
              <p className="text-xs flex items-center gap-2">
                <span className="gradient-text uppercase font-bold text-4xl md:text-5xl">
                  {experienceInYears}+
                </span>
                <span className="flex flex-col text-left font-bold italic">
                  Years <br />
                  experience...
                </span>
              </p>
              <p className="text-sm md:text-base">
                Design-minded engineer shipping production software since 2020,
                across fintech and SaaS.
              </p>
            </div>
            {/* Clients Number */}
            <div className="flex flex-col gap-4 w-full md:w-[50%]">
              <p className="text-xs flex items-center gap-2">
                <span className="gradient-text uppercase font-bold text-4xl md:text-5xl">
                  10+
                </span>
                <span className="flex flex-col text-left font-bold italic">
                  Clients <br />
                  Worldwide...
                </span>
              </p>
              <p className="text-sm md:text-base">
                With {experienceInYears}+ years experience as a professional
                full-stack developer, I have acquired the skills and knowledge
                necessary to make your project a success.
              </p>
            </div>
          </div>

          <div className="bg-black dark:bg-white p-4 flex flex-col gap-2 text-white dark:text-black justify-between items-start rounded-md">
            <p className="flex gap-2 text-sm md:text-base">
              <Icon icon="line-md:check-all" width="20" height="20" className="md:w-6 md:h-6" inline />
              Develop highly interactive Front end / User Interfaces for the web
            </p>
            <p className="flex gap-2 text-sm md:text-base">
              <Icon icon="line-md:check-all" width="20" height="20" className="md:w-6 md:h-6" inline />
              Progressive Web Applications ( PWA ) in normal and SPA Stacks
            </p>
            <p className="flex gap-2 text-sm md:text-base">
              <Icon icon="line-md:check-all" width="20" height="20" className="md:w-6 md:h-6" inline />
              Integration of third party services such as AWS / Digital Ocean
            </p>
            <p className="flex gap-2 text-sm md:text-base">
              <Icon icon="line-md:check-all" width="20" height="20" className="md:w-6 md:h-6" inline />
              Integration of payment services such as M-Pesa, Monnify,
              Flutterwave and paypal etc
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-6 items-stretch md:items-start">
            <button
              className="dark:bg-white bg-black text-white py-4 px-8 font-medium dark:text-black flex justify-center gap-4 text-base md:text-lg leading-6 rounded-lg hover:scale-105 transition-transform"
              onClick={() => scrollToSection("experience")}
            >
              View My Experience{" "}
              <img src={NorthEast} alt="" className="w-5 h-5 md:w-auto md:h-auto" />
            </button>
            <button
              className="border-2 border-black dark:border-white py-4 px-8 font-medium flex justify-center gap-4 text-base md:text-lg leading-6 rounded-lg hover:scale-105 transition-transform"
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
