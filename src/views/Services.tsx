import services from "@/data/services";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Icon } from "@iconify/react/dist/iconify.js";

function Services() {
  return (
    <section id="services" className="w-full p-4 md:p-8 flex flex-col gap-8">
      <div id="Heading" className="flex flex-col gap-4 w-full text-left">
        <span className="capitalize italic text-[16px] md:text-[18px] font-semibold">
          i like to make things easy and fun
        </span>
        <span className="uppercase font-bold text-[18px] md:text-[20px]">
          My <span className="gradient-text">specialties</span> for your{" "}
          <span className="gradient-text">business development.</span>
        </span>
      </div>
      <div className="p-2 md:p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
        {services.map((service, index) => (
          <Card
            key={index}
            className="flex flex-col gap-4 items-center card max-w-[400px] font-montserrat hover:bg-black hover:dark:bg-white hover:dark:!text-black hover:!text-white transition-all duration-300 ease-linear hover:scale-105 active:scale-95"
          >
            <CardHeader className="items-center uppercase font-semibold p-4 md:p-6">
              <div className="gradient p-3 md:p-4 rounded-full text-white">
                <Icon icon={service.icon} width={32} height={32} className="md:w-11 md:h-11" />
              </div>
              <CardTitle className="text-[16px] md:text-[18px] font-semibold mt-2">
                {service.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center p-4 md:p-6 pt-0">
              <CardDescription className="text-[13px] md:text-[14px] !text-inherit">
                {service.desc}
              </CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

export default Services;
