import { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import Blankcry from "@/assets/logo_100x40.svg";
import { SidebarProvider, Sidebar, SidebarHeader, SidebarContent, SidebarFooter } from "@/components/ui/sidebar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";

const navItems = [
  { title: "Home", href: "home" },
  { title: "About", href: "about" },
  { title: "Services", href: "services" },
  { title: "works", href: "works" },
  { title: "contacts", href: "contacts" },
  { title: "blogs", href: "blogs" },
];

function NavLinks({ activeSection, handleScroll }: { activeSection: string; handleScroll: (id: string) => void }) {
  return (
    <div className="flex-1 flex flex-col gap-2 text-left font-ibm uppercase">
      {navItems.map((item) => (
        <div
          key={item.title}
          onClick={() => handleScroll(item.href)}
          className={
            "hover:cursor-pointer hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:font-bold px-8 py-4 rounded-md transition-all duration-700" +
            (activeSection === item.href ? " bg-sidebar-accent text-sidebar-accent-foreground font-bold" : " text-sidebar-foreground")
          }
        >
          <span>{item.title}</span>
        </div>
      ))}
    </div>
  );
}

function SocialLinks() {
  return (
    <div className="flex flex-col gap-4 px-4">
      <div className="flex flex-col gap-4">
        <a href="https://facebook.com/james-yunana" className="text-sidebar-foreground hover:text-sidebar-accent-foreground">
          <Icon icon="ic:round-facebook" width="24" height="24" />
        </a>
        <a href="https://x.com/james_yuna" className="text-sidebar-foreground hover:text-sidebar-accent-foreground">
          <Icon icon="ri:twitter-x-line" width="24" height="24" />
        </a>
        <a href="https://instagram.com/james_yuna" className="text-sidebar-foreground hover:text-sidebar-accent-foreground">
          <Icon icon="ph:instagram-logo-thin" width="24" height="24" />
        </a>
      </div>
      <p className="text-xs text-muted-foreground">© 2025 Blankcry</p>
    </div>
  );
}

function Navbar() {
  const [activeSection, setActiveSection] = useState<string>("");
  const isMobile = useIsMobile();
  const [sheetOpen, setSheetOpen] = useState(false);

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.5, // Trigger when 50% of the section is visible
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, observerOptions);

    // Observe all sections
    navItems.forEach((item) => {
      const element = document.getElementById(item.href);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      // Cleanup observer on component unmount
      observer.disconnect();
    };
  }, []);

  const handleScroll = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      setActiveSection(id);
      element.scrollIntoView({ behavior: "smooth" });
      if (isMobile) setSheetOpen(false); // Close sheet on mobile after navigation
    }
  };

  // Desktop Sidebar
  if (!isMobile) {
    return (
      <SidebarProvider>
        <Sidebar className="bg-sidebar p-2 text-sidebar-foreground md:flex-col md:h-screen border-r border-sidebar-border max-w-max sticky gap-8 dark:border-sidebar-border hidden md:flex">
          <SidebarHeader>
            <a href="/" target="_blank">
              <img
                src={Blankcry}
                className="h-[100px]"
                alt="Blankcry logo"
                width={200}
                height={"100px"}
              />
            </a>
          </SidebarHeader>
          <SidebarContent>
            <NavLinks activeSection={activeSection} handleScroll={handleScroll} />
          </SidebarContent>
          <SidebarFooter>
            <SocialLinks />
          </SidebarFooter>
        </Sidebar>
      </SidebarProvider>
    );
  }

  // Mobile Sheet
  return (
    <div className="fixed top-0 left-0 z-50 flex items-center justify-between w-full bg-sidebar text-sidebar-foreground p-4 md:hidden">
      <a href="/" target="_blank">
        <img
          src={Blankcry}
          className="h-[40px]"
          alt="Blankcry logo"
          width={100}
          height={"40px"}
        />
      </a>
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetTrigger asChild>
          <button aria-label="Open menu" className="text-black dark:text-white rounded-lg">
            <Icon icon="mdi:menu" width="32" height="32" />
          </button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 bg-sidebar text-sidebar-foreground w-64">
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-center p-6 border-b border-sidebar-border">
              <a href="/" target="_blank">
                <img
                  src={Blankcry}
                  className="h-[60px]"
                  alt="Blankcry logo"
                  width={120}
                  height={"60px"}
                />
              </a>
            </div>
            <div className="flex-1 overflow-y-auto">
              <NavLinks activeSection={activeSection} handleScroll={handleScroll} />
            </div>
            <div className="border-t border-sidebar-border p-4">
              <SocialLinks />
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

export default Navbar;
