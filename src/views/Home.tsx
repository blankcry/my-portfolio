import HeroImage from "@/assets/heroImage.png";
import AppleClip from "@/assets/apple-art.svg";
import NorthEast from "@/assets/north_east.svg";
import { Icon } from "@iconify/react";

function Home() {
  const handleScroll = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };
  return (
    <section
      id="home"
      className="w-full h-screen snap-start flex flex-col justify-center items-center gap-8 px-4 md:px-24"
    >
      <div className="flex-1 flex flex-col md:flex-row gap-8 md:gap-4 w-full">
        <div className="p-2 md:p-4 w-full flex flex-col gap-6 items-center md:items-start">
          <div>
            <img
              src={AppleClip}
              className="-rotate-12 relative -bottom-8 md:-bottom-16 -left-8 md:-left-16 w-16 md:w-auto"
            />
            <span className="uppercase text-[48px] md:text-[102px] leading-[42px] md:leading-[90px]">
              my name <br />
              is{" "}
              <span className="font-bold">
                james <br /> yunana...
              </span>
            </span>
            <br />
            <span className="text-[20px] md:text-[32px] leading-5 tracking-tight text-nowrap flex flex-wrap gap-2 items-center text-left font-ibm">
              <span className="font-bold italic capitalize">
                software developer
              </span>{" "}
              based in{" "}
              <Icon icon="game-icons:nigeria" fill="green" stroke="green" />{" "}
            </span>
          </div>
          <button
            className="dark:bg-white bg-black text-white py-3 px-6 font-medium dark:text-black flex gap-4 text-[16px] md:text-[18px] leading-6"
            onClick={() => handleScroll("about")}
          >
            Connect with me <img src={NorthEast} className="w-5 h-5 md:w-auto md:h-auto" />
          </button>
          <div className="flex gap-x-6 items-center">
            <hr className="w-[80px] md:w-[120px] h-[2px] border-0 bg-black dark:bg-white" />
            <a href="https://facebook.com/james-yunana" className="hover:opacity-80 transition-opacity">
              <Icon icon="ic:round-facebook" width="24" height="24" />
            </a>
            <a href="https://x.com/james_yuna" className="hover:opacity-80 transition-opacity">
              <Icon icon="ri:twitter-x-line" width="24" height="24" />
            </a>
            <a href="https://instagram.com/james_yuna" className="hover:opacity-80 transition-opacity">
              <Icon icon="ph:instagram-logo-thin" width="24" height="24" />
            </a>
          </div>
          <div className="flex flex-col md:flex-row justify-start gap-4 items-center w-full">
            <span className="flex gap-3 items-center text-sm md:text-base">
              <Icon icon="el:phone-alt" width="20" height="20" className="md:w-6 md:h-6" />
              +234 704 101 8558
            </span>
            <span className="flex gap-3 items-center text-sm md:text-base">
              <Icon icon="mdi:email-box" width="20" height="20" className="md:w-6 md:h-6" />
              <span>gajejames@outlook.com</span>
            </span>
          </div>
        </div>
        <div className="w-full flex justify-center md:block">
          <img src={HeroImage} className="w-[280px] md:w-auto h-auto" />
        </div>
      </div>
      <div className="mx-auto w-full flex justify-center items-center cursor-pointer animate-bounce" onClick={() => handleScroll("about")}>
        <Icon icon="carbon:down-to-bottom" width="32" height="32" />
      </div>
    </section>
  );
}

export default Home;
