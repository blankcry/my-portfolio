function Blogs() {
  return (
    <section id="blogs" className="w-full p-8 flex flex-col gap-8 h-screen">
         <div
           id="Heading"
           className="flex flex-col gap-4 w-full text-center justify-center"
         >
           <span className="capitalize font-bold text-[30px]">
             Explore my <span className="gradient-text">Mind.</span>
           </span>
         </div>
         <div className="flex-1 flex text-center w-full justify-center items-center">
           <span className="capitalize font-bold text-[58px]">
             Coming<span className="gradient-text"> Soon.</span>
           </span>

         </div>
       </section>
  );
}

export default Blogs;
