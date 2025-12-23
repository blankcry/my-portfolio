import { AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Skeleton } from "@/components/ui/skeleton";

export function ExperienceItemSkeleton() {
  return (
    <AccordionItem value="skeleton" className="w-full">
      <AccordionTrigger className="justify-end gap-2 bg-transparent text-white">
        <div className="flex flex-col gap-2 w-full">
          <div className="flex flex-col md:flex-row justify-between w-full text-sm md:text-base">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-4 w-1/3" />
          </div>
          <Skeleton className="h-4 w-1/2" />
        </div>
      </AccordionTrigger>
    </AccordionItem>
  );
}
