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
      className="w-full p-32 flex flex-col gap-8 h-screen font-ibm"
    >
      <div className="flex gap-4 w-full">
        <div className="p-4 w-full flex flex-col gap-6 items-start">
          <div>
            <img
              src={AppleClip}
              className="-rotate-12 relative -bottom-16 -left-16"
            />
            <span className="uppercase text-[102px] leading-[90px]">
              my name <br />
              is{" "}
              <span className="font-bold">
                james <br /> yunana...
              </span>
            </span>
            <br />
            <span className="text-[32px] leading-5 tracking-tight text-nowrap flex gap-2 items-center text-left font-ibm">
              <span className="font-bold italic capitalize">
                software developer
              </span>{" "}
              based in{" "}
              <Icon icon="game-icons:nigeria" fill="green" stroke="green" />{" "}
            </span>
          </div>
          <button
            className="dark:bg-white bg-black text-white py-3 px-6 font-medium dark:text-black flex gap-4 text-[18px] leading-6"
            onClick={() => handleScroll("about")}
          >
            Connect with me <img src={NorthEast} />
          </button>
          <div className="flex gap-x-6 items-center">
            <hr className="w-[120px] h-[2px] border-0 bg-black dark:bg-white" />
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
          <div className="flex justify-start gap-4 items-center w-full">
            <span className="flex gap-3 items-center">
              <Icon icon="el:phone-alt" width="24" height="24" />
              +234 704 101 8558
            </span>
            <span className="flex gap-3 items-center">
              <Icon icon="mdi:email-box" width="24" height="24" />
              <span>gajejames@outlook.com</span>
            </span>
          </div>
        </div>
        <div className="w-full">
          <img src={HeroImage} />
        </div>
      </div>
    </section>
  );
}

export default Home;
