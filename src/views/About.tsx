import HeroImage from "@/assets/heroImage.png";
import NorthEastBlack from "@/assets/north_east_black.svg";
import { Icon } from "@iconify/react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

function About() {
  const experienceInYears = dayjs("2020-01-01").toNow(true).split(" ")[0];
  return (
    <section id="about" className="w-full snap-start flex flex-col gap-8 min-h-screen">
      <div
        id="Heading"
        className="flex flex-col gap-4 w-full text-left px-4 md:px-24 py-8 md:py-12 pb-0"
      >
        <span className="capitalize italic text-base md:text-lg font-semibold">
          nice to meet you!
        </span>
        <span className="uppercase font-bold text-3xl md:text-4xl">
          you can call me....
        </span>
      </div>
      <div className="flex flex-col md:flex-row justify-evenly gap-8 md:gap-4 w-full px-4 md:px-24">
        <div className="flex flex-col gap-4 w-full text-center items-center font-ibm">
          <div className="relative p-1 rounded-full gradient">
            <img 
              src={HeroImage} 
              className="w-[280px] md:w-[400px] rounded-full object-cover aspect-square relative z-10 shadow-lg hover:scale-105 transition-transform duration-300" 
              alt="Profile picture"
            />
          </div>
          <div>
            <p className="gradient-text uppercase font-bold text-4xl md:text-5xl">
              blankcry
            </p>
            <p className="text-base md:text-lg capitalize">
              <span className="font-extrabold italic">
                Full Stack Developer
              </span>{" "}
              with an eye for detail
            </p>
          </div>
          <a href="https://docs.google.com/document/d/1P81SG_ILDA_xWMfAKbVF41KLqrmsuWcGYFdIqX0obsk/edit?usp=sharing" className="flex gap-4 items-center">
            <span className="underline dark:decoration-white">Download CV</span>
            <img src={NorthEastBlack} width={20} height={20} />
          </a>
        </div>
        <div className="flex flex-col w-full gap-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <span className="flex gap-3 items-center text-sm md:text-base">
              <Icon icon="el:phone-alt" width="20" height="20" className="md:w-6 md:h-6" />
              +234 704 101 8558
            </span>
            <span className="flex gap-3 items-center text-sm md:text-base">
              <Icon icon="iconamoon:profile-duotone" width="20" height="20" className="md:w-6 md:h-6" />
              {dayjs().from(dayjs("1998-10-04"), true)}
            </span>
            <span className="flex gap-3 items-center text-sm md:text-base">
              <Icon icon="mdi:email-box" width="20" height="20" className="md:w-6 md:h-6" />
              <span>gajejames@outlook.com</span>
            </span>
            <span className="flex gap-3 items-center text-sm md:text-base">
              <Icon icon="dashicons:location" width="18" height="18" className="md:w-5 md:h-5" />
              <span>Abuja, Nigeria</span>
            </span>
          </div>
          <hr className="border-0 bg-black dark:bg-white h-[2px] w-full" />
          <div className="flex flex-col md:flex-row justify-between gap-8 md:gap-4">
            {/* Years Experience */}
            <div className="flex flex-col gap-4 w-full md:w-[50%]">
              <p className="text-xs flex items-center gap-2">
                <span className="gradient-text uppercase font-bold text-4xl md:text-5xl">
                  {experienceInYears}+
                </span>
                <span className="flex flex-col text-left font-bold italic">
                  Years <br />
                  experience...
                </span>
              </p>
              <p className="text-sm md:text-base">
                Hello there! My name is James Yunana I am a web designer &
                developer, and I'm very passionate and dedicated to my work.
              </p>
            </div>
            {/* Clients Number */}
            <div className="flex flex-col gap-4 w-full md:w-[50%]">
              <p className="text-xs flex items-center gap-2">
                <span className="gradient-text uppercase font-bold text-4xl md:text-5xl">
                  10+
                </span>
                <span className="flex flex-col text-left font-bold italic">
                  Clients <br />
                  Worldwide...
                </span>
              </p>
              <p className="text-sm md:text-base">
                With {experienceInYears}+ years experience as a professional a full-stack
                developer, I have acquired the skills and knowledge necessary to
                make your project a success.
              </p>
            </div>
          </div>
          <div className="bg-black dark:bg-white p-4 flex flex-col gap-2 text-white dark:text-black justify-between items-start rounded-md">
            <p className="flex gap-2 text-sm md:text-base">
              <Icon icon="line-md:check-all" width="20" height="20" className="md:w-6 md:h-6" inline />
              Develop highly interactive Front end / User Interfaces for the web
            </p>
            <p className="flex gap-2 text-sm md:text-base">
              <Icon icon="line-md:check-all" width="20" height="20" className="md:w-6 md:h-6" inline />
              Progressive Web Applications ( PWA ) in normal and SPA Stacks
            </p>
            <p className="flex gap-2 text-sm md:text-base">
              <Icon icon="line-md:check-all" width="20" height="20" className="md:w-6 md:h-6" inline />
              Integration of third party services such as AWS / Digital Ocean
            </p>
            <p className="flex gap-2 text-sm md:text-base">
              <Icon icon="line-md:check-all" width="20" height="20" className="md:w-6 md:h-6" inline />
              Integration of payment services such as M-Pesa, Monnify,
              Flutterwave and paypal etc
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;
