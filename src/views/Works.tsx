import projects from "@/data/projects";

function Works() {
  return (
    <section id="works" className="w-full p-8 flex flex-col gap-8">
      <div
        id="Heading"
        className="flex flex-col gap-4 w-full text-center justify-center"
      >
        <span className="capitalize font-bold text-[30px]">
          Explore my <span className="gradient-text">Projects.</span>
        </span>
      </div>
      <div className="flex flex-col gap-4 items-center p-12">
        <div className="w-full flex flex-col gap-4 items-center text-center">
          <img src={projects[0].photo_url} width={400} />
          <div className="flex gap-4 items-center">
            <span className="gradient-text">{projects[0].type}</span>
            <span className="gradient-text">{projects[0].type}</span>
            
          </div>
        </div>
      </div>
    </section>
  );
}

export default Works;
