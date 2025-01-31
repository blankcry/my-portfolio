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
    {
      title: "contacts",
      href: "contacts",
    },
  ];
  const handleScroll = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };
  return (
    <nav className="bg-black dark:bg-white text-white dark:text-black flex flex-col h-screen border-r-2 border-white dark:border-black max-w-max sticky gap-8 p-4">
      <a href="/" target="_blank">
        <img
          src={Blankcry}
          className="h-[100px]"
          alt="Blankcry logo"
          width={200}
          height={"100px"}
        />
      </a>
      <div className="flex flex-col gap-2 text-left font-ibm uppercase">
        {components.map((component) => (
          <div
            key={component.title}
            onClick={() => handleScroll(component.href)}
            className="hover:cursor-pointer hover:bg-slate-500 hover:text-white hover:font-bold px-8 py-4 rounded-md"
          >
            <span key={component.title}>{component.title}</span>
          </div>
        ))}
      </div>
    </nav>
  );
}

export default Navbar;
