import Navbar from "@/components/Navbar";
import About from "@/views/About";
import Blogs from "@/views/Blogs";
// import Contacts from "@/views/Contacts";
import Home from "@/views/Home";
import Services from "@/views/Services";
import Works from "@/views/Works";

function Landing() {
  return (
    <div className="bg-white text-black dark:bg-black dark:text-white h-screen flex flex-row justify-start">
      <Navbar />
      <div className="w-full h-screen overflow-y-auto">
        <Home />
        <About />
        <Services />
        <Works />
        <Blogs />
        {/* <Contacts /> */}
      </div>
    </div>
  );
}

export default Landing;
