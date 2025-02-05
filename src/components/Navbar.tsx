import { useState } from "react";
import { Icon } from "@iconify/react";
import Blankcry from "@/assets/logo_100x40.svg";

function Navbar() {
  const components: { title: string; href: string }[] = [
    {
      title: "Home",
      href: "home",
    },
    {
      title: "About",
      href: "about",
    },
    {
      title: "Services",
      href: "services",
    },
    {
      title: "works",
      href: "works",
    },
    {
      title: "blogs",
      href: "blogs",
    },
    // {
    //   title: "contacts",
    //   href: "contacts",
    // },
  ];
  const [activeSection, setActiveSection] = useState<string>("");
  const handleScroll = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      setActiveSection(id);
      element.scrollIntoView({ behavior: "smooth" });
    }
  };
  return (
    <nav className="bg-black text-white flex md:flex-col md:h-screen border-r-2 border-white max-w-max sticky gap-8 p-4 dark:border-r-2 dark:border-white">
      <a href="/" target="_blank">
        <img
          src={Blankcry}
          className="h-[100px]"
          alt="Blankcry logo"
          width={200}
          height={"100px"}
        />
      </a>
      <div className="flex-1 flex md:flex-col gap-2 text-left font-ibm uppercase">
        {components.map((component) => (
          <div
            key={component.title}
            onClick={() => handleScroll(component.href)}
            className={
              "hover:cursor-pointer hover:bg-white hover:text-black hover:font-bold px-8 py-4 rounded-md transition-all duration-700" +
              (activeSection === component.href
                ? " bg-white text-black font-bold"
                : "")
            }
          >
            <span key={component.title}>{component.title}</span>
          </div>
        ))}
      </div>
      {/* Bottom Elements */}
      <div className="flex flex-col gap-4 px-4">
        {/* Social Links or Logout */}
        <div className="flex flex-col gap-4 ">
          <a href="https://facebook.com/james-yunana">
            <Icon icon="ic:round-facebook" width="24" height="24" />
          </a>
          <a href="https://x.com/james_yuna">
            <Icon icon="ri:twitter-x-line" width="24" height="24" />
          </a>
          <a href="https://instagram.com/james_yuna">
            <Icon icon="ph:instagram-logo-thin" width="24" height="24" />
          </a>
        </div>
        <p className="text-xs text-gray-400">© 2025 Blankcry</p>
      </div>
    </nav>
  );
}

export default Navbar;
