import { ThemeProvider } from "@/components/theme-provider";
import { SmoothScrollProvider } from "@/components/scroll/SmoothScrollProvider";
import Preloader from "@/components/preloader/Preloader";
import HeroPortraitLayer from "@/components/hero/HeroPortraitLayer";
import Navbar from "@/components/Navbar";
import Home from "@/views/Home";
import About from "@/views/About";
import Experience from "@/views/Experience";
import Services from "@/views/Services";
import Works from "@/views/Works";
import Contacts from "@/views/Contacts";
import Blogs from "@/views/Blogs";

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <SmoothScrollProvider>
        <Preloader />
        <div className="min-h-[100dvh] bg-background text-foreground">
          <Navbar />
          {/* Scrolling happens on the window, not here — `relative` makes this
              the coordinate space for the document-spanning hero layer. */}
          <main className="relative md:ml-56 bg-white text-black dark:bg-black dark:text-white">
            <HeroPortraitLayer />
            <Home />
            <About />
            <Experience />
            <Services />
            <Works />
            <Contacts />
            <Blogs />
          </main>
        </div>
      </SmoothScrollProvider>
    </ThemeProvider>
  );
}

export default App;
