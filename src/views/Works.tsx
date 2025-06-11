import projects from "@/data/projects";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ExternalLink, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

function Works() {
  const [isMobile, setIsMobile] = useState(false);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleProjectClick = (url: string) => {
    if (isMobile) {
      window.open(url, '_blank');
    }
  };

  const displayedProjects = showAll ? projects : projects.slice(0, 5);

  return (
    <section id="works" className="w-full snap-start flex flex-col gap-8 px-4 md:px-24 gradient rounded-t-[7rem] rounded-xl">
      <div className="flex flex-col gap-4 w-full text-center justify-center text-white">
        <span className="capitalize font-bold text-[30px] md:text-[40px]">
          Explore my <span className="gradient-text">Projects.</span>
        </span>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          A collection of my recent work and personal projects. Each project represents a unique challenge and solution.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
        {displayedProjects.map((project, index) => (
          <Dialog key={index}>
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
                  <CardDescription className="line-clamp-2">{project.desc}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {project.stack?.slice(0, 3).map((tech, i) => (
                      <Badge key={i} variant="secondary">{tech}</Badge>
                    ))}
                    {project.stack?.length > 3 && (
                      <Badge variant="outline">+{project.stack.length - 3} more</Badge>
                    )}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" className="w-full" asChild>
                    <a href={project.url} target="_blank" rel="noopener noreferrer">
                      {isMobile ? (
                        <>
                          Visit Site <ExternalLink className="ml-2 h-4 w-4" />
                        </>
                      ) : (
                        "View Details"
                      )}
                    </a>
                  </Button>
                </CardFooter>
              </Card>
            </DialogTrigger>
            {!isMobile && (
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
                        <Badge key={i} variant="secondary">{tech}</Badge>
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
            )}
          </Dialog>
        ))}
        
        {!showAll && projects.length > 5 && (
          <Card 
            className="cursor-pointer hover:shadow-lg transition-all duration-300 border-dashed"
            onClick={() => setShowAll(true)}
          >
            <CardHeader className="flex items-center justify-center h-full">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                  <ChevronRight className="w-8 h-8 text-primary" />
                </div>
                <CardTitle>Show More Projects</CardTitle>
                <CardDescription>
                  View {projects.length - 5} more projects
                </CardDescription>
              </div>
            </CardHeader>
          </Card>
        )}
      </div>
    </section>
  );
}

export default Works;
