import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useSmoothScroll } from "@/components/scroll/SmoothScrollProvider";
import { SECTION_IDS, type SectionId } from "@/lib/sections";
import Home from "@/views/Home";
import About from "@/views/About";
import Experience from "@/views/Experience";
import Services from "@/views/Services";
import Works from "@/views/Works";
import Contacts from "@/views/Contacts";
import Blogs from "@/views/Blogs";

/** The one-pager. Every child is exactly one viewport and snaps hard. */
export function HomePage() {
  const { hash } = useLocation();
  const { scrollToSection } = useSmoothScroll();

  // Support `/#contacts`-style deep links (the detail page's CTAs use them).
  // Deferred a tick so the sections have laid out before we measure.
  useEffect(() => {
    const id = hash.replace("#", "") as SectionId;
    if (!id || !SECTION_IDS.includes(id)) return;
    const t = window.setTimeout(() => scrollToSection(id), 120);
    return () => window.clearTimeout(t);
  }, [hash, scrollToSection]);

  return (
    <>
      <Home />
      <About />
      <Experience />
      <Services />
      <Works />
      <Contacts />
      <Blogs />
    </>
  );
}

export default HomePage;
