// LEGACY — superseded by Services.tsx (redesigned to match a reference reel, 2026-08).
// Not imported anywhere. Kept for reference / easy revert.
import { useRef } from "react";
import services from "@/data/services";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useReveal } from "@/hooks/useReveal";
import { useSmoothScroll } from "@/components/scroll/SmoothScrollProvider";

function Services() {
  const rootRef = useRef<HTMLElement>(null);
  const { motionEnabled } = useSmoothScroll();
  useReveal(rootRef, { enabled: motionEnabled });

  return (
    <section
      id="services"
      ref={rootRef}
      className="min-h-[100dvh] w-full flex flex-col gap-8 px-4 md:px-24 py-12"
    >
      <div id="Heading" className="flex flex-col gap-4 w-full text-left">
        <span data-reveal className="capitalize italic text-base md:text-lg font-semibold">
          i like to make things easy and fun
        </span>
        <span data-reveal className="uppercase font-bold text-lg md:text-xl">
          My <span className="gradient-text">specialties</span> for your{" "}
          <span className="gradient-text">business development.</span>
        </span>
      </div>
      <div className="p-2 md:p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
        {services.map((service, index) => (
          <Card
            key={index}
            data-reveal
            className="flex flex-col gap-2 items-center card max-w-[400px] font-montserrat hover:bg-black hover:dark:bg-white hover:dark:!text-black hover:!text-white transition-all duration-300 ease-linear hover:scale-105 active:scale-95"
          >
            <CardHeader className="items-center uppercase font-semibold p-4 md:p-6">
              <div className="gradient p-3 md:p-4 rounded-full text-white">
                <Icon icon={service.icon} width={32} height={32} className="md:w-11 md:h-11" />
              </div>
              <span className="text-xs text-nowrap font-semibold mt-2">
                {service.name}
              </span>
            </CardHeader>
            <CardContent className="text-center p-4">
              <CardDescription className="text-sm">{service.desc}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

export default Services;
