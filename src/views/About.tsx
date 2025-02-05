import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import HeroImage from "@/assets/heroImage.png";
import NorthEastBlack from "@/assets/north_east_black.svg";
import { Icon } from "@iconify/react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import experience from "@/data/experience";

dayjs.extend(relativeTime);

function About() {
  const handleScroll = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };
  return (
    <section id="about" className="w-full flex flex-col gap-8">
      <div
        id="Heading"
        className="flex flex-col gap-4 w-full text-left px-24 py-12 pb-0"
      >
        <span className="capitalize italic text-[18px] font-semibold">
          nice to meet you!
        </span>
        <span className="uppercase font-bold text-[40px]">
          you can call me....
        </span>
      </div>
      <div className="flex justify-evenly gap-4 w-full px-24">
        <div className="flex flex-col gap-4 w-full text-center items-center font-ibm">
          <img src={HeroImage} width={400} />
          <div>
            <p className="gradient-text uppercase font-bold text-[48px]">
              blankcry
            </p>
            <p className="text-[18px] capitalize">
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
          <div className="grid grid-cols-2 gap-4">
            <span className="flex gap-3 items-center">
              <Icon icon="el:phone-alt" width="24" height="24" />
              +234 704 101 8558
            </span>
            <span className="flex gap-3 items-center">
              <Icon icon="iconamoon:profile-duotone" width="24" height="24" />
              {dayjs().from(dayjs("1998-10-04"), true)}
            </span>
            <span className="flex gap-3 items-center">
              <Icon icon="mdi:email-box" width="24" height="24" />
              <span>gajejames@outlook.com</span>
            </span>
            <span className="flex gap-3 items-center">
              <Icon icon="dashicons:location" width="20" height="20" />
              <span>Abuja, Nigeria</span>
            </span>
          </div>
          <hr className="border-0 bg-black dark:bg-white h-[2px] w-full" />
          <div className="flex justify-between ">
            {/* Years Experience */}
            <div className="flex flex-col gap-4 w-[50%]">
              <p className="text-[12px] flex items-center gap-2">
                <span className="gradient-text uppercase font-bold text-[48px]">
                  {dayjs("2021-01-01").toNow(true).split(" ")[0]}+
                </span>
                <span className="flex flex-col text-left font-bold italic">
                  Years <br />
                  experience...
                </span>
              </p>
              <p>
                Hello there! My name is James Yunana I am a web designer &
                developer, and I'm very passionate and dedicated to my work.
              </p>
            </div>
            {/* Clients Number */}
            <div className="flex flex-col gap-4 w-[50%]">
              <p className="text-[12px] flex items-center gap-2">
                <span className="gradient-text uppercase font-bold text-[48px]">
                  10+
                </span>
                <span className="flex flex-col text-left font-bold italic">
                  Clients <br />
                  Worldwide...
                </span>
              </p>
              <p>
                With 4+ years experience as a professional a full-stack
                developer, I have acquired the skills and knowledge necessary to
                make your project a success.
              </p>
            </div>
          </div>
          <div className="bg-black dark:bg-white p-4 flex flex-col gap-2 text-white dark:text-black justify-between items-start rounded-md">
            <p className="flex gap-2">
              <Icon icon="line-md:check-all" width="24" height="24" inline />
              Develop highly interactive Front end / User Interfaces for the web
            </p>
            <p className="flex gap-2">
              <Icon icon="line-md:check-all" width="24" height="24" inline />
              Progressive Web Applications ( PWA ) in normal and SPA Stacks
            </p>
            <p className="flex gap-2">
              <Icon icon="line-md:check-all" width="24" height="24" inline />
              Integration of third party services such as AWS / Digital Ocean
            </p>
            <p className="flex gap-2">
              <Icon icon="line-md:check-all" width="24" height="24" inline />
              Integration of payment services such as M-Pesa, Monnify,
              Flutterwave and paypal etc
            </p>
          </div>
        </div>
      </div>
      <div className="mx-auto w-full flex justify-center items-center cursor-pointer" onClick={() => handleScroll("experience")}>
      <Icon icon="carbon:down-to-bottom" width="32" height="32" />
      </div>
      <div id="experience" className="gradient w-full px-24 py-12 flex justify-between gap-16 text-white">
        <div className="w-[50%] font-ibm flex flex-col gap-4">
          <span className="italic font-semibold">Experience</span>
          <span className="text-4xl font-extrabold">MY EXPERIENCE</span>
          <span>
            I am a full stack web developer, with experience in creating
            different application such as fintech apps and Saas. I am primarily
            skilled in Javascript with usage on both backend and frontend, I
            also have usable knowledge in Python for backend applications, and
            willing to learn whatever needs be on the Job. I have developed and
            worked on production applications that host millions of users and
            deliver value to our customers. I have experience with wearing
            multiple hats in the industry ranging from project management to
            database administration to more technical skills set like tutoring
            customers on complex B2B applications, taking customer feedback and
            improving system functionality based on their needs. I have
            experience with creating and modifying features that require change
            in legacy systems. I have experience with payment services,
            integrating multiple solutions and strategies for payment collection
            and distribution, while keeping manual input to a minimal level.
            Overall, I am experienced in writing scalable code on both the
            backend and frontend applications that don't flutter with increase
            in users.
          </span>
        </div>
        <div className="w-[50%]">
          <Accordion type="single" collapsible className="">
            {experience.map((exp, index) => (
              <AccordionItem value={`${index}`} key={index}>
                <AccordionTrigger className="justify-end gap-2 bg-transparent text-white">
                  <div className="flex flex-col gap-2 w-full">
                    <div className="flex justify-between w-full">
                      <span>
                        {exp.date.start} - {exp.date.end}
                      </span>
                      <span>{exp.company}</span>
                    </div>
                    <span>{exp.position}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="w-full flex flex-col gap-2 font-ibm">
                    {Array.isArray(exp.desc) ? (
                      exp.desc.map((desc, index) => (
                        <span key={index} className="flex gap-2">
                          {" "}
                          <Icon
                            icon="line-md:check-all"
                            width="24"
                            height="24"
                            inline
                          />
                          {desc}
                        </span>
                      ))
                    ) : (
                      <span>{exp.desc}</span>
                    )}
                    <span className="italic">
                      <span className="font-semibold">Skills:</span>{" "}
                      {Array.isArray(exp.skills)
                        ? exp.skills?.join(", ")
                        : exp.skills?.split(" · ").join(", ")}
                    </span>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}

export default About;
