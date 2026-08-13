import { Link, useLocation } from "react-router-dom";
import { Icon } from "@iconify/react";
import Blankcry from "@/assets/logo_100x40.svg";
import { useSmoothScroll } from "@/components/scroll/SmoothScrollProvider";
import { useHeaderScrollState } from "@/hooks/useHeaderScrollState";
import { useNavActiveState } from "@/hooks/useNavActiveState";
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
  const { scrollToSection } = useSmoothScroll();
  const { isHome, isActive } = useNavActiveState();
  const { hidden, scrolled } = useHeaderScrollState({ resetKey: pathname });

  const handleNavigate = (id: SectionId) => {
    scrollToSection(id);
  };

  const desktopLinkClass = (active: boolean) =>
    "font-ibm text-sm uppercase tracking-wide transition-colors " +
    (active ? "font-bold text-green-500" : "text-foreground/70 hover:text-foreground");

  // On the one-pager, nav items smooth-scroll in place; anywhere else they're
  // real links back to `/#<section>`, which HomePage picks up via its hash effect.
  const renderNavItem = (item: (typeof NAV_ITEMS)[number]) => {
    const active = isActive(item.href);
    const className = desktopLinkClass(active);

    if (isHome) {
      return (
        <button key={item.href} onClick={() => handleNavigate(item.href)} className={className}>
          {item.title}
        </button>
      );
    }
    return (
      <Link key={item.href} to={`/#${item.href}`} className={className}>
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
        "fixed inset-x-0 top-0 z-50 h-16 " +
        (hidden
          ? "-translate-y-2 opacity-0 pointer-events-none transition-[opacity,transform] duration-700 ease-out motion-reduce:transition-none"
          : "translate-y-0 opacity-100 transition-[opacity,transform] duration-300 ease-out motion-reduce:transition-none")
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
          {NAV_ITEMS.map((item) => renderNavItem(item))}
        </nav>

        <SocialLinks className="hidden md:flex" />
      </div>
    </header>
  );
}

export default Header;
