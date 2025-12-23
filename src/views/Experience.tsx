import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Icon } from "@iconify/react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useExperience } from "@/hooks/useExperience";
import { ExperienceItemSkeleton } from "@/components/ExperienceItemSkeleton";

dayjs.extend(relativeTime);

interface ExperienceItem {
  start_date: string;
  end_date: string | null;
  company: string;
  position: string;
  desc: string[];
  skills: string[];
}

function Experience() {
  const { experience, loading, error }: { experience: ExperienceItem[], loading: boolean, error: string | null } = useExperience();
  return (
    <section id="experience" className="w-full snap-start flex flex-col gap-8">
      <div className="gradient md:rounded-t-[7rem] rounded-xl w-full px-4 md:px-24 py-8 md:py-12 flex flex-col md:flex-row justify-between gap-8 md:gap-16 text-white">
        <div className="w-full md:w-[50%] font-ibm flex flex-col gap-4">
          <span className="italic font-semibold text-sm md:text-base">Experience</span>
          <span className="text-2xl md:text-4xl font-extrabold">MY EXPERIENCE</span>
          <span className="text-sm md:text-base">
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
        <div className="w-full md:w-[50%]">
          <Accordion type="single" collapsible className="">
            {loading && Array.from({ length: 5 }).map((_, i) => <ExperienceItemSkeleton key={i} />)}
            {error && <p className="text-white">Error fetching experience: {error}</p>}
            {!loading && !error && experience.map((exp: ExperienceItem, index: number) => (
              <AccordionItem value={`${index}`} key={index}>
                <AccordionTrigger className="justify-end gap-2 bg-transparent text-white">
                  <div className="flex flex-col gap-2 w-full">
                    <div className="flex flex-col md:flex-row justify-between w-full text-sm md:text-base">
                      <span>
                        {exp.start_date} - {exp.end_date}
                      </span>
                      <span>{exp.company}</span>
                    </div>
                    <span className="text-sm md:text-base">{exp.position}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="w-full flex flex-col gap-2 font-ibm">
                    {exp.desc && exp.desc.map((item: string, index: number) => (
                      <span key={index} className="flex gap-2 text-sm md:text-base">
                        <Icon
                          icon="line-md:check-all"
                          width="20"
                          height="20"
                          className="md:w-6 md:h-6"
                          inline
                        />
                        {item}
                      </span>
                    ))}
                    <span className="italic text-sm md:text-base">
                      <span className="font-semibold">Skills:</span>{" "}
                      {exp.skills?.join(", ")}
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

export default Experience;
