function Blogs() {
  return (
    <section
      id="blogs"
      className="w-full h-screen snap-start flex flex-col gap-4 px-4 md:px-14"
    >
      <div
        id="Heading"
        className="flex flex-col gap-4 w-full text-center justify-center"
      >
        <span className="capitalize font-bold text-[20px]">
          Explore my <span className="gradient-text">Mind.</span>
        </span>
      </div>
      <div className="flex-1 flex text-center w-full justify-center items-center">
        <span className="capitalize font-bold text-[48px]">
          Coming<span className="gradient-text"> Soon.</span>
        </span>
      </div>
    </section>
  );
}

export default Blogs;
