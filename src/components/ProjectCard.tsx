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
import { forwardRef } from "react";
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

interface ProjectPropsI {
  project: Project;
}

/**
 * Presentational card with no Dialog wrapper. The Works ring renders this on its
 * own at the centre of the circle; ProjectCard below wraps it in the dialog.
 */
export const ProjectCardBody = forwardRef<
  HTMLDivElement,
  ProjectPropsI & React.HTMLAttributes<HTMLDivElement>
>(({ project, className, ...props }, ref) => (
  <Card
    ref={ref}
    className={`cursor-pointer hover:shadow-lg transition-all duration-300 ${className ?? ""}`}
    {...props}
  >
    <CardHeader>
      <div className="aspect-video relative overflow-hidden rounded-lg">
        <img
          src={project.photo_url?.[0]}
          alt={project.name}
          loading="lazy"
          className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
        />
      </div>
      <CardTitle className="mt-4">{project.name}</CardTitle>
      <CardDescription className="line-clamp-2">{project.desc}</CardDescription>
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
        {/* stopPropagation so following the link doesn't also open the dialog */}
        <a
          href={project.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
        >
          Visit Site <ExternalLink className="ml-2 h-4 w-4" />
        </a>
      </Button>
      <Button variant="ghost" className="w-full">
        View Details
      </Button>
    </CardFooter>
  </Card>
));
ProjectCardBody.displayName = "ProjectCardBody";

function ProjectCard({ project }: ProjectPropsI) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <ProjectCardBody project={project} />
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{project.name}</DialogTitle>
          <DialogDescription>{project.desc}</DialogDescription>
        </DialogHeader>
        <div className="aspect-video relative overflow-hidden rounded-lg">
          <Carousel className="w-full">
            <CarouselContent>
              {project.photo_url?.map((photo, i) => (
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
    </Dialog>
  );
}

export default ProjectCard;
