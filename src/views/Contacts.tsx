import { useRef } from "react";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { useReveal } from "@/hooks/useReveal";
import { useSmoothScroll } from "@/components/scroll/SmoothScrollProvider";

function Contacts() {
  const rootRef = useRef<HTMLElement>(null);
  const { motionEnabled } = useSmoothScroll();
  useReveal(rootRef, { enabled: motionEnabled });

  const handleEmailClick = () => {
    window.location.href = "mailto:gajejames@outlook.com";
  };

  const handleWhatsAppClick = () => {
    window.open("https://wa.me/2347041018558", "_blank");
  };

  return (
    <section id="contacts" ref={rootRef} className="w-full min-h-[100dvh] bg-white dark:bg-black text-black dark:text-white flex flex-col justify-center items-center gap-8 px-4 md:px-24">
      <div className="flex flex-col items-center gap-8 w-full">
        <div data-reveal className="w-32 h-32 flex items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/5 backdrop-blur-sm border border-primary/20 shadow-lg hover:scale-105 transition-transform duration-300">
          <Icon icon="mdi:handshake" width="64" height="64" className="text-primary" />
        </div>
        
        <div className="flex flex-col gap-4 w-full text-center">
          <span data-reveal className="capitalize italic text-lg font-semibold">
            Let's work together
          </span>
          <span data-reveal className="uppercase font-bold text-4xl md:text-5xl">
            Tell me about your next project
          </span>
        </div>

        <div data-reveal className="flex flex-col md:flex-row gap-4 w-full max-w-md">
          <Button 
            onClick={handleEmailClick}
            className="flex-1 h-12 text-lg"
          >
            <Icon icon="mdi:email" className="mr-2" />
            Email Me
          </Button>
          
          <Button 
            onClick={handleWhatsAppClick}
            variant="outline"
            className="flex-1 h-12 text-lg"
          >
            <Icon icon="mdi:whatsapp" className="mr-2" />
            WhatsApp
          </Button>
        </div>
      </div>
    </section>
  );
}

export default Contacts;
