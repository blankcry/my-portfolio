import { useProjects } from "@/hooks/useProjects";
import { ProjectCardSkeleton } from "@/components/ProjectCardSkeleton";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";
import { useState } from "react";
import ProjectCard from "@/components/ProjectCard";

function Works() {
  const { projects, loading, error } = useProjects();
  const [showAll, setShowAll] = useState(false);

  const projectsToDisplay = 3;

  const displayedProjects = showAll ? projects : projects.slice(0, projectsToDisplay);

  return (
    <section id="works" className="w-full snap-start flex flex-col gap-8 p-4 md:px-24 gradient md:rounded-t-[7rem] rounded-xl">
      <div className="flex flex-col gap-4 w-full text-center justify-center text-white">
        <span className="capitalize font-bold text-[30px] md:text-[40px]">
          Explore my <span className="gradient-text">Projects.</span>
        </span>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          A collection of my recent work and personal projects. Each project represents a unique challenge and solution.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
        {loading && Array.from({ length: 6 }).map((_, i) => <ProjectCardSkeleton key={i} />)}
        {error && <p>Error fetching projects: {error}</p>}
        {!loading && !error && displayedProjects.map((project, index) => (
          <ProjectCard project={project} key={index} />
        ))}
        
        {!showAll && projects.length > projectsToDisplay && (
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
                  View {projects.length - projectsToDisplay} more projects
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
