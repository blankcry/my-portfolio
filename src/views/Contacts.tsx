import { useRef } from "react";
import { Icon } from "@iconify/react";
import HeroImage from "@/assets/heroImage.webp";
import { useReveal } from "@/hooks/useReveal";
import { useSmoothScroll } from "@/components/scroll/SmoothScrollProvider";

const SOCIALS = [
  { label: "Facebook", icon: "ic:round-facebook", href: "https://facebook.com/james-yunana" },
  { label: "X", icon: "ri:twitter-x-line", href: "https://x.com/james_yuna" },
  { label: "Instagram", icon: "ph:instagram-logo-thin", href: "https://instagram.com/james_yuna" },
  { label: "WhatsApp", icon: "mdi:whatsapp", href: "https://wa.me/2347041018558" },
];

/**
 * Redesigned to match the reference reel: availability pill, oversized
 * question headline, two-line copy, a single dark CTA, and a row of pill
 * links with an identity chip leading. See Contacts.legacy.tsx for the
 * previous version.
 */
function Contacts() {
  const rootRef = useRef<HTMLElement>(null);
  const { motionEnabled } = useSmoothScroll();
  useReveal(rootRef, { enabled: motionEnabled });

  return (
    <section
      id="contacts"
      ref={rootRef}
      className="flex section-vh w-full flex-col items-center justify-center gap-6 overflow-hidden px-4 md:px-16"
    >
      <span
        data-reveal
        className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2 text-sm shadow-sm dark:border-white/15 dark:bg-neutral-900"
      >
        <span className="h-2 w-2 rounded-full bg-green-500" />
        Available for New Project
      </span>

      <h2
        data-reveal
        className="text-center text-3xl font-extrabold uppercase leading-tight md:text-6xl"
      >
        Have a project in mind?
      </h2>

      <p
        data-reveal
        className="max-w-2xl text-center text-base text-gray-600 dark:text-gray-400 md:text-lg"
      >
        Together, we can create something clear and impactful. Let's collaborate to bring
        our ideas to life in a way that resonates with everyone.
      </p>

      <a
        data-reveal
        href="mailto:gajejames@outlook.com"
        className="btn-jump inline-flex items-center gap-2 rounded-full bg-black px-7 py-3.5 text-sm font-medium text-white shadow-lg dark:bg-white dark:text-black md:text-base"
      >
        Contact Me
        <Icon icon="carbon:arrow-up-right" width={18} height={18} />
      </a>

      <div data-reveal className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <span className="inline-flex items-center gap-2 rounded-full bg-black py-1.5 pl-1.5 pr-4 text-sm font-medium text-white dark:bg-white dark:text-black">
          <img
            src={HeroImage}
            alt=""
            className="h-7 w-7 rounded-full object-cover object-top"
          />
          James Yunana
        </span>

        {SOCIALS.map((social) => (
          <a
            key={social.label}
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2 text-sm shadow-sm transition-transform hover:scale-105 dark:border-white/15 dark:bg-neutral-900"
          >
            <Icon icon={social.icon} width={16} height={16} />
            {social.label}
          </a>
        ))}
      </div>
    </section>
  );
}

export default Contacts;
