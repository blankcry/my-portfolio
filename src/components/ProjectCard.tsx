import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import { Button } from "@/components/ui/button.tsx";
import { ExternalLink } from "lucide-react";
import { Project } from "@/types";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";

// interface ProjectPropsTriggerI {
//   project: Project;
//   isMobile: boolean;
// }
interface ProjectPropsI {
  project: Project;
}
// function ProjectCardTrigger({ project, isMobile }: ProjectPropsTriggerI) {
//   const handleProjectClick = (url: string) => {
//     if (isMobile) {
//       window.open(url, "_blank");
//     }
//   };

//   return (
//     <Card
//       className="cursor-pointer hover:shadow-lg transition-all duration-300"
//       onClick={() => handleProjectClick(project.url)}
//     >
//       <CardHeader>
//         <div className="aspect-video relative overflow-hidden rounded-lg">
//           <img
//             src={project.photo_url[0]}
//             alt={project.name}
//             className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
//           />
//         </div>
//         <CardTitle className="mt-4">{project.name}</CardTitle>
//         <CardDescription className="line-clamp-2">
//           {project.desc}
//         </CardDescription>
//       </CardHeader>
//       <CardContent>
//         <div className="flex flex-wrap gap-2">
//           {project.stack?.slice(0, 3).map((tech, i) => (
//             <Badge key={i} variant="secondary">
//               {tech}
//             </Badge>
//           ))}
//           {project.stack?.length > 3 && (
//             <Badge variant="outline">+{project.stack.length - 3} more</Badge>
//           )}
//         </div>
//       </CardContent>
//       <CardFooter>
//         <Button variant="ghost" className="w-full" asChild>
//           <a href={project.url} target="_blank" rel="noopener noreferrer">
//             Visit Site <ExternalLink className="ml-2 h-4 w-4" />
//           </a>
//         </Button>
//         <Button variant="ghost" className="w-full">
//           View Details
//         </Button>
//       </CardFooter>
//     </Card>
//   );
// }

function ProjectCard({ project }: ProjectPropsI) {
  const [isMobile, setIsMobile] = useState(false);
  const handleProjectClick = (url: string) => {
    if (isMobile) {
      window.open(url, "_blank");
    }
  };
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);
  return (
    <Dialog>
      <DialogTrigger asChild>
      <Card
      className="cursor-pointer hover:shadow-lg transition-all duration-300"
      onClick={() => handleProjectClick(project.url)}
    >
      <CardHeader>
        <div className="aspect-video relative overflow-hidden rounded-lg">
          <img
            src={project.photo_url[0]}
            alt={project.name}
            className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
          />
        </div>
        <CardTitle className="mt-4">{project.name}</CardTitle>
        <CardDescription className="line-clamp-2">
          {project.desc}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {project.stack?.slice(0, 3).map((tech, i) => (
            <Badge key={i} variant="secondary">
              {tech}
            </Badge>
          ))}
          {project.stack?.length > 3 && (
            <Badge variant="outline">+{project.stack.length - 3} more</Badge>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="ghost" className="w-full" asChild>
          <a href={project.url} target="_blank" rel="noopener noreferrer">
            Visit Site <ExternalLink className="ml-2 h-4 w-4" />
          </a>
        </Button>
        <Button variant="ghost" className="w-full">
          View Details
        </Button>
      </CardFooter>
    </Card>
        {/* <ProjectCardTrigger project={project} isMobile={isMobile} /> */}
      </DialogTrigger>
      {/* {!isMobile && ( */}
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{project.name}</DialogTitle>
            <DialogDescription>{project.desc}</DialogDescription>
          </DialogHeader>
          <div className="aspect-video relative overflow-hidden rounded-lg">
            <Carousel className="w-full">
              <CarouselContent>
                {project.photo_url.map((photo, i) => (
                  <CarouselItem key={i}>
                    <div className="aspect-video relative overflow-hidden rounded-lg">
                      <img
                        src={photo}
                        alt={`${project.name} - Image ${i + 1}`}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-2" />
              <CarouselNext className="right-2" />
            </Carousel>
          </div>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Tech Stack</h4>
              <div className="flex flex-wrap gap-2">
                {project.stack?.map((tech, i) => (
                  <Badge key={i} variant="secondary">
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="flex gap-4">
              <Button className="w-full" asChild>
                <a href={project.url} target="_blank" rel="noopener noreferrer">
                  Visit Site <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
        </DialogContent>
      {/* )} */}
    </Dialog>
  );
}

export default ProjectCard;
