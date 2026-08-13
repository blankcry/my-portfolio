import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Icon } from "@iconify/react";
import Blankcry from "@/assets/logo_100x40.svg";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useSmoothScroll } from "@/components/scroll/SmoothScrollProvider";
import { useHeaderScrollState } from "@/hooks/useHeaderScrollState";
import { NAV_ITEMS, type SectionId } from "@/lib/sections";

function SocialLinks({ className = "" }: { className?: string }) {
  return (
    <div className={"flex items-center gap-4 " + className}>
      <a
        href="https://facebook.com/james-yunana"
        className="text-foreground/60 transition-colors hover:text-foreground"
      >
        <Icon icon="ic:round-facebook" width="20" height="20" />
      </a>
      <a
        href="https://x.com/james_yuna"
        className="text-foreground/60 transition-colors hover:text-foreground"
      >
        <Icon icon="ri:twitter-x-line" width="20" height="20" />
      </a>
      <a
        href="https://instagram.com/james_yuna"
        className="text-foreground/60 transition-colors hover:text-foreground"
      >
        <Icon icon="ph:instagram-logo-thin" width="20" height="20" />
      </a>
    </div>
  );
}

function Header() {
  const { pathname } = useLocation();
  const { activeSection, scrollToSection } = useSmoothScroll();
  const [sheetOpen, setSheetOpen] = useState(false);
  const { hidden, scrolled } = useHeaderScrollState({ paused: sheetOpen, resetKey: pathname });

  // The one-pager tracks a section per scroll position; /work and /work/:slug
  // don't have sections at all, so "Works" reads as current for that whole area.
  const isHome = pathname === "/";
  const isWorkRoute = pathname.startsWith("/work");
  const isActive = (href: SectionId) =>
    isHome ? activeSection === href : isWorkRoute && href === "works";

  const handleNavigate = (id: SectionId) => {
    scrollToSection(id);
    setSheetOpen(false);
  };

  const desktopLinkClass = (active: boolean) =>
    "font-ibm text-sm uppercase tracking-wide transition-colors " +
    (active ? "font-bold text-green-500" : "text-foreground/70 hover:text-foreground");

  const mobileLinkClass = (active: boolean) =>
    "rounded-md px-4 py-3 text-left font-ibm uppercase transition-colors " +
    (active
      ? "font-bold text-green-500 bg-green-500/10"
      : "text-foreground/80 hover:bg-foreground/5");

  // On the one-pager, nav items smooth-scroll in place; anywhere else they're
  // real links back to `/#<section>`, which HomePage picks up via its hash effect.
  const renderNavItem = (item: (typeof NAV_ITEMS)[number], variant: "desktop" | "mobile") => {
    const active = isActive(item.href);
    const className = variant === "desktop" ? desktopLinkClass(active) : mobileLinkClass(active);

    if (isHome) {
      return (
        <button key={item.href} onClick={() => handleNavigate(item.href)} className={className}>
          {item.title}
        </button>
      );
    }
    return (
      <Link
        key={item.href}
        to={`/#${item.href}`}
        onClick={() => setSheetOpen(false)}
        className={className}
      >
        {item.title}
      </Link>
    );
  };

  const logo = (
    <img src={Blankcry} className="h-8 w-auto" alt="Blankcry logo" width={100} height={40} />
  );

  return (
    <header
      className={
        "fixed inset-x-0 top-0 z-50 h-16 transition-transform duration-300 motion-reduce:transition-none " +
        (hidden ? "-translate-y-full" : "translate-y-0")
      }
    >
      {/* Transparent at rest; gains a blurred, theme-aware backdrop once content
          has scrolled underneath it so nav text stays legible either way. */}
      <div
        className={
          "absolute inset-0 -z-10 border-b transition-colors duration-300 " +
          (scrolled
            ? "border-border/60 bg-background/75 backdrop-blur-md"
            : "border-transparent bg-transparent")
        }
      />

      <div className="mx-auto flex h-full w-full max-w-6xl items-center justify-between px-4 md:px-8">
        {isHome ? (
          <button onClick={() => handleNavigate("home")} aria-label="Back to top">
            {logo}
          </button>
        ) : (
          <Link to="/" aria-label="Back to home">
            {logo}
          </Link>
        )}

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_ITEMS.map((item) => renderNavItem(item, "desktop"))}
        </nav>

        <SocialLinks className="hidden md:flex" />

        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger asChild>
            <button aria-label="Open menu" className="text-foreground md:hidden">
              <Icon icon="gg:menu-right" width="32" height="32" />
            </button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[80%] bg-background p-0 text-foreground">
            {/* Radix requires a title on every dialog surface for screen readers. */}
            <SheetTitle className="sr-only">Navigation menu</SheetTitle>
            <div className="flex h-full flex-col">
              <div className="flex items-center justify-center border-b border-border p-6">
                <img
                  src={Blankcry}
                  className="h-[50px]"
                  alt="Blankcry logo"
                  width={120}
                  height={50}
                />
              </div>
              <div className="flex-1 overflow-y-auto py-4" data-lenis-prevent>
                <div className="flex flex-col gap-2 px-4">
                  {NAV_ITEMS.map((item) => renderNavItem(item, "mobile"))}
                </div>
              </div>
              <div className="border-t border-border p-4">
                <SocialLinks />
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}

export default Header;
