import Navbar from "@/components/Navbar";
import About from "@/views/About";
import Blogs from "@/views/Blogs";
import Contacts from "@/views/Contacts";
import Home from "@/views/Home";
import Services from "@/views/Services";
import Works from "@/views/Works";
import backgroundImage from "../assets/background.jpg";
import Blankcry from "@/assets/logo_100x40.svg";

function Landing() {
  return (
    <div className="bg-white text-black dark:bg-black dark:text-white h-screen flex flex-row justify-start">
      <Navbar />
      <div className="w-full h-screen overflow-y-auto hidden md:block">
        <Home />
        <About />
        <Services />
        <Works />
        <Blogs />
        <Contacts />
      </div>
      <div
        className="md:hidden flex justify-center items-center h-screen text-white p-8 text-nowrap"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          width: "100%",
        }}
      >
        <div className="flex flex-col gap-8 items-center p-16 text-sm">
          <a href="/" target="_blank">
            <img
              src={Blankcry}
              className="h-[100px]"
              alt="Blankcry logo"
              width={200}
              height={"100px"}
            />
          </a>
          <span>This Webpage doesn't support a mobile view</span>
        </div>
      </div>
    </div>
  );
}

export default Landing;
