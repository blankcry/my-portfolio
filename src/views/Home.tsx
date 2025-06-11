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
      className="w-full snap-start flex flex-col justify-center items-center p-4 md:px-20"
    >
      <div className="flex flex-col-reverse md:flex-row gap-4 w-full max-w-7xl">
        <div className="p-2 md:p-4 w-full flex flex-col gap-4 items-start">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
              <span className="text-sm font-medium text-green-500">Available for freelance work</span>
            </div>
            <div>
              <img
                src={AppleClip}
                className="-rotate-12 relative -bottom-8 md:-bottom-16 -left-8 md:-left-16 w-16 md:w-auto"
              />
              <h1 className="uppercase text-2xl md:text-6xl leading-tight font-montserrat">
                Crafting Digital <br/>
                <span className="font-bold gradient-text">
                  Experiences
                </span>
              </h1>
            </div>
            <p className="text-xl md:text-3xl leading-tight tracking-tight text-nowrap flex flex-wrap gap-2 items-center text-left font-ibm">
              <span className="font-semibold italic capitalize">
                Full Stack Developer
              </span>
              <span className="text-gray-600 dark:text-gray-400">based in</span>
              <Icon icon="game-icons:nigeria" fill="green" stroke="green" className="w-6 h-6" />
            </p>
            <p className="text-base md:text-lg text-gray-600 dark:text-gray-400 max-w-xl">
              I transform ideas into elegant, functional digital solutions. With expertise in both frontend and backend development, I create seamless web experiences that drive results.
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-6 items-start">
            <button
              className="dark:bg-white bg-black text-white py-4 px-8 font-medium dark:text-black flex gap-4 text-base md:text-lg leading-6 rounded-lg hover:scale-105 transition-transform"
              onClick={() => handleScroll("experience")}
            >
              View My Experience <img src={NorthEast} className="w-5 h-5 md:w-auto md:h-auto" />
            </button>
            <button
              className="border-2 border-black dark:border-white py-4 px-8 font-medium flex gap-4 text-base md:text-lg leading-6 rounded-lg hover:scale-105 transition-transform"
              onClick={() => handleScroll("contacts")}
            >
              Let's Talk
            </button>
          </div>

          <div className="flex flex-col gap-6 w-full">
            <div className="flex gap-6 items-start">
              <hr className="w-[80px] md:w-[120px] h-[2px] border-0 bg-black dark:bg-white" />
              <div className="flex gap-4">
                <a href="https://facebook.com/james-yunana" className="hover:opacity-80 transition-opacity hover:scale-110">
                  <Icon icon="ic:round-facebook" width="24" height="24" />
                </a>
                <a href="https://x.com/james_yuna" className="hover:opacity-80 transition-opacity hover:scale-110">
                  <Icon icon="ri:twitter-x-line" width="24" height="24" />
                </a>
                <a href="https://instagram.com/james_yuna" className="hover:opacity-80 transition-opacity hover:scale-110">
                  <Icon icon="ph:instagram-logo-thin" width="24" height="24" />
                </a>
              </div>
            </div>

            <div className="flex flex-col md:flex-row justify-start gap-6 items-start w-full">
              <span className="flex gap-3 items-center text-sm md:text-base hover:text-green-500 transition-colors cursor-pointer">
                <Icon icon="el:phone-alt" width="20" height="20" className="md:w-6 md:h-6" />
                +234 704 101 8558
              </span>
              <span className="flex gap-3 items-center text-sm md:text-base hover:text-green-500 transition-colors cursor-pointer">
                <Icon icon="mdi:email-box" width="20" height="20" className="md:w-6 md:h-6" />
                <span>gajejames@outlook.com</span>
              </span>
            </div>
          </div>
        </div>
        <div className="w-full flex justify-center md:block relative">
          <div className="relative w-[280px] md:w-[400px] h-[280px] md:h-[400px]">
            {/* Decorative elements */}
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-transparent rounded-full blur-3xl animate-pulse" />
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-green-500/10 rounded-full blur-2xl" />
            <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-green-500/10 rounded-full blur-2xl" />
            
            {/* Main image container */}
            <div className="relative w-full h-full">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent rounded-full animate-spin-slow" />
              <img 
                src={HeroImage} 
                className="w-full h-full object-cover rounded-full relative z-10 shadow-2xl hover:scale-105 transition-transform duration-500"
                alt="James Yunana - Full Stack Developer"
              />
            </div>

            {/* Floating elements */}
            <div className="absolute -top-6 -right-6 w-12 h-12 bg-white dark:bg-black rounded-full flex items-center justify-center shadow-lg animate-float">
              <Icon icon="mdi:code-braces" className="w-6 h-6 text-green-500" />
            </div>
            <div className="absolute -bottom-6 -left-6 w-12 h-12 bg-white dark:bg-black rounded-full flex items-center justify-center shadow-lg animate-float-delayed">
              <Icon icon="mdi:server" className="w-6 h-6 text-green-500" />
            </div>
          </div>
        </div>
      </div>
      <div className="mx-auto w-full flex justify-center items-center cursor-pointer animate-bounce mt-8" onClick={() => handleScroll("about")}>
        <Icon icon="carbon:down-to-bottom" width="32" height="32" />
      </div>
    </section>
  );
}

export default Home;
