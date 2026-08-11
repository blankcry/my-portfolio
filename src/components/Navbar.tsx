import { useState } from "react";
import { Icon } from "@iconify/react";
import Blankcry from "@/assets/logo_100x40.svg";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { useSmoothScroll } from "@/components/scroll/SmoothScrollProvider";
import { NAV_ITEMS, type SectionId } from "@/lib/sections";

function NavLinks({
  activeSection,
  onNavigate,
}: {
  activeSection: SectionId | "";
  onNavigate: (id: SectionId) => void;
}) {
  return (
    <div className="flex-1 flex flex-col gap-2 text-left font-ibm uppercase">
      {NAV_ITEMS.map((item) => (
        <button
          key={item.href}
          onClick={() => onNavigate(item.href)}
          className={
            "text-left hover:cursor-pointer hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:font-bold px-8 py-4 rounded-md transition-all duration-500" +
            (activeSection === item.href
              ? " bg-sidebar-accent text-sidebar-accent-foreground font-bold"
              : " text-sidebar-foreground")
          }
        >
          <span>{item.title}</span>
        </button>
      ))}
    </div>
  );
}

function SocialLinks() {
  return (
    <div className="flex flex-col gap-4 px-4">
      <div className="flex flex-col gap-4">
        <a
          href="https://facebook.com/james-yunana"
          className="text-sidebar-foreground hover:text-sidebar-accent-foreground"
        >
          <Icon icon="ic:round-facebook" width="24" height="24" />
        </a>
        <a
          href="https://x.com/james_yuna"
          className="text-sidebar-foreground hover:text-sidebar-accent-foreground"
        >
          <Icon icon="ri:twitter-x-line" width="24" height="24" />
        </a>
        <a
          href="https://instagram.com/james_yuna"
          className="text-sidebar-foreground hover:text-sidebar-accent-foreground"
        >
          <Icon icon="ph:instagram-logo-thin" width="24" height="24" />
        </a>
      </div>
      <p className="text-xs text-muted-foreground">© 2025 Blankcry</p>
    </div>
  );
}

function Navbar() {
  const isMobile = useIsMobile();
  const [sheetOpen, setSheetOpen] = useState(false);
  const { activeSection, scrollToSection } = useSmoothScroll();

  const handleNavigate = (id: SectionId) => {
    scrollToSection(id);
    if (isMobile) setSheetOpen(false);
  };

  // Desktop rail. Deliberately a plain <aside> rather than shadcn's <Sidebar>:
  // that component renders a fixed panel *plus* an in-flow spacer, which only
  // makes sense inside a flex row — and the layout is no longer a flex row.
  if (!isMobile) {
    return (
      <aside className="hidden md:flex fixed inset-y-0 left-0 z-40 w-56 flex-col justify-between gap-8 bg-sidebar p-2 text-sidebar-foreground border-r border-sidebar-border">
        <button
          className="flex justify-center p-2"
          onClick={() => handleNavigate("home")}
          aria-label="Back to top"
        >
          <img
            src={Blankcry}
            className="h-[100px]"
            alt="Blankcry logo"
            width={200}
            height={100}
          />
        </button>
        <NavLinks activeSection={activeSection} onNavigate={handleNavigate} />
        <SocialLinks />
      </aside>
    );
  }

  // Mobile header. `h-16` is load-bearing — MOBILE_HEADER_H in lib/gsap.ts is the
  // offset every snap target and click-nav subtracts, and the two must agree.
  return (
    <nav className="sticky top-0 z-50 flex h-16 items-center justify-between w-full bg-sidebar text-sidebar-foreground px-4 md:hidden">
      <button onClick={() => handleNavigate("home")} aria-label="Back to top">
        <img src={Blankcry} className="h-[40px]" alt="Blankcry logo" width={100} height={40} />
      </button>
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetTrigger asChild>
          <button aria-label="Open menu" className="rounded-lg bg-inherit">
            <Icon icon="gg:menu-right" width="42" height="42" />
          </button>
        </SheetTrigger>
        <SheetContent
          side="right"
          className="p-0 bg-sidebar text-sidebar-foreground w-[80%]"
        >
          {/* Radix requires a title on every dialog surface for screen readers. */}
          <SheetTitle className="sr-only">Navigation menu</SheetTitle>
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-center p-6 border-b border-sidebar-border">
              <img
                src={Blankcry}
                className="h-[60px]"
                alt="Blankcry logo"
                width={120}
                height={60}
              />
            </div>
            <div className="flex-1 overflow-y-auto" data-lenis-prevent>
              <NavLinks activeSection={activeSection} onNavigate={handleNavigate} />
            </div>
            <div className="border-t border-sidebar-border p-4">
              <SocialLinks />
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </nav>
  );
}

export default Navbar;
