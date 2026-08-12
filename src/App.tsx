import { Route, Routes } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { SmoothScrollProvider } from "@/components/scroll/SmoothScrollProvider";
import Preloader from "@/components/preloader/Preloader";
import Navbar from "@/components/Navbar";
import HomePage from "@/pages/HomePage";
import WorkPage from "@/pages/WorkPage";
import ProjectPage from "@/pages/ProjectPage";

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <SmoothScrollProvider>
        <Preloader />
        {/* app-canvas paints the one background for the whole site; every
            section below is transparent. */}
        <div className="app-canvas min-h-[100dvh] text-foreground">
          <Navbar />
          {/* z-10 keeps content above the canvas's fixed tint layer. */}
          <main className="relative z-10 min-h-[100dvh] md:ml-56">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/work" element={<WorkPage />} />
              <Route path="/work/:slug" element={<ProjectPage />} />
              {/* Unknown paths fall back to the one-pager rather than a dead end. */}
              <Route path="*" element={<HomePage />} />
            </Routes>
          </main>
        </div>
      </SmoothScrollProvider>
    </ThemeProvider>
  );
}

export default App;
