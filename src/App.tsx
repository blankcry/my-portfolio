import { ThemeProvider } from "@/components/theme-provider";
import Navbar from "@/components/Navbar";
import Home from "@/views/Home";
import About from "@/views/About";
import Services from "@/views/Services";
import Works from "@/views/Works";
import Contacts from "@/views/Contacts";
import Blogs from "@/views/Blogs";

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <div className="flex flex-col md:flex-row min-h-screen bg-background text-foreground">
        <Navbar />
        <main className="flex-1 overflow-y-auto snap-y snap-mandatory h-screen bg-white text-black dark:bg-black dark:text-white">
          <Home />
          <About />
          <Services />
          <Works />
          <Contacts />
          <Blogs />
        </main>
      </div>
    </ThemeProvider>
  );
}

export default App;
