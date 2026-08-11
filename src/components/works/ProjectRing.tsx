import { useRef, useState } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { ProjectCardBody } from "@/components/ProjectCard";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ExternalLink } from "lucide-react";
import type { Project } from "@/types";

const SPIN_SECONDS = 42;
/** Vertical squash of the circle — reads as perspective without a 3D context. */
const SQUASH = 0.55;
const LEAVE_GRACE_MS = 300;

interface ProjectRingProps {
  projects: Project[];
  motionEnabled: boolean;
}

/**
 * Projects orbit a circle; hovering one brings it to the centre and hands off to
 * a full card.
 *
 * Two decisions worth knowing:
 * - The rotation drives a plain object, not a CSS transform on a wrapper. Doing
 *   the trig per node per frame is what buys depth-based scale/opacity/z-index,
 *   which a wrapper rotation cannot express (and it avoids counter-rotating
 *   every node to keep it upright).
 * - Ring nodes are small thumbnails; ONE full card lives at the centre and
 *   crossfades its contents. The hovered node fades out as it arrives and the
 *   card fades in over it, so the card never animates its own layout — which is
 *   the fragile way to build this.
 */
export function ProjectRing({ projects, motionEnabled }: ProjectRingProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const centreRef = useRef<HTMLDivElement>(null);
  const spinRef = useRef<gsap.core.Tween | null>(null);
  const leaveTimer = useRef<number | undefined>(undefined);

  const [focused, setFocused] = useState<number | null>(null);

  const n = projects.length;
  const focusedProject = focused !== null ? projects[focused] : null;

  useGSAP(
    () => {
      const container = containerRef.current;
      if (!motionEnabled || !container || n === 0) return;

      const size = container.offsetWidth;
      if (size <= 0) return;

      const radius = size * (n <= 4 ? 0.3 : 0.38);
      const spin = { angle: 0 };

      const render = () => {
        for (let i = 0; i < n; i++) {
          const node = nodeRefs.current[i];
          if (!node) continue;
          const a = (i / n) * Math.PI * 2 + spin.angle;
          const depth = (1 + Math.cos(a)) / 2; // 1 = front, 0 = back
          gsap.set(node, {
            x: radius * Math.sin(a),
            y: -radius * Math.cos(a) * SQUASH,
            scale: 0.72 + 0.28 * depth,
            opacity: 0.45 + 0.55 * depth,
            zIndex: Math.round(depth * 20),
          });
        }
      };

      const tween = gsap.to(spin, {
        angle: Math.PI * 2,
        duration: SPIN_SECONDS,
        ease: "none",
        repeat: -1,
        onUpdate: render,
      });
      spinRef.current = tween;
      render();

      // Entrance: nodes fly out of the centre when the section arrives.
      gsap.from(nodeRefs.current.filter(Boolean), {
        scale: 0,
        autoAlpha: 0,
        stagger: 0.06,
        duration: 0.7,
        ease: "back.out(1.4)",
        scrollTrigger: { trigger: "#works", start: "top 80%", once: true },
      });

      ScrollTrigger.create({
        trigger: "#works",
        start: "top bottom",
        end: "bottom top",
        onToggle: (self) => (self.isActive ? tween.play() : tween.pause()),
      });

      return () => {
        spinRef.current = null;
      };
    },
    { dependencies: [n, motionEnabled], scope: containerRef, revertOnUpdate: true }
  );

  const { contextSafe } = useGSAP({ scope: containerRef });

  const focus = contextSafe((i: number) => {
    window.clearTimeout(leaveTimer.current);
    if (focused === i) return;
    setFocused(i);

    // Decelerate rather than hard-pause; a sudden stop reads as a bug.
    if (spinRef.current) gsap.to(spinRef.current, { timeScale: 0, duration: 0.5 });

    nodeRefs.current.forEach((node, idx) => {
      if (!node) return;
      if (idx === i) {
        gsap.to(node, {
          x: 0,
          y: 0,
          scale: 1.1,
          autoAlpha: 0,
          duration: 0.5,
          ease: "power3.out",
          overwrite: "auto",
        });
      } else {
        gsap.to(node, { scale: 0.72, opacity: 0.25, duration: 0.4, overwrite: "auto" });
      }
    });

    gsap.fromTo(
      centreRef.current,
      { autoAlpha: 0, scale: 0.94, y: 12 },
      { autoAlpha: 1, scale: 1, y: 0, duration: 0.45, ease: "power3.out", delay: 0.2 }
    );
  });

  const blur = contextSafe(() => {
    window.clearTimeout(leaveTimer.current);
    leaveTimer.current = window.setTimeout(() => {
      setFocused(null);
      gsap.to(centreRef.current, { autoAlpha: 0, scale: 0.96, duration: 0.3 });
      nodeRefs.current.forEach((node) => {
        if (node) gsap.to(node, { autoAlpha: 1, duration: 0.3, overwrite: "auto" });
      });
      // Resuming the spin hands x/y/scale/opacity back to `render()`.
      if (spinRef.current) gsap.to(spinRef.current, { timeScale: 1, duration: 0.9 });
    }, LEAVE_GRACE_MS);
  });

  if (n === 0) return null;

  const nodeSize = Math.round(gsap.utils.mapRange(5, 12, 160, 110, gsap.utils.clamp(5, 12, n)));

  return (
    <div
      ref={containerRef}
      className="relative mx-auto aspect-square w-full max-w-[820px]"
      onMouseLeave={blur}
    >
      {/* Orbiting thumbnails */}
      {projects.map((project, i) => (
        <button
          key={project.id}
          ref={(el) => {
            nodeRefs.current[i] = el;
          }}
          type="button"
          onMouseEnter={() => focus(i)}
          onFocus={() => focus(i)}
          onClick={() => focus(i)}
          aria-label={`Show ${project.name}`}
          style={{ width: nodeSize, height: nodeSize, marginLeft: -nodeSize / 2, marginTop: -nodeSize / 2 }}
          className="absolute left-1/2 top-1/2 overflow-hidden rounded-2xl border border-white/20 bg-white/10 shadow-lg backdrop-blur-sm"
        >
          <img
            src={project.photo_url?.[0]}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover"
          />
          <span className="absolute inset-x-0 bottom-0 bg-black/60 px-2 py-1 text-[11px] font-semibold text-white truncate">
            {project.name}
          </span>
        </button>
      ))}

      {/* The single card at the centre */}
      <div
        ref={centreRef}
        className="pointer-events-none absolute left-1/2 top-1/2 z-30 w-[min(360px,80%)] -translate-x-1/2 -translate-y-1/2 opacity-0"
      >
        {focusedProject && (
          <Dialog>
            <DialogTrigger asChild>
              <ProjectCardBody
                project={focusedProject}
                className="pointer-events-auto bg-background"
              />
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>{focusedProject.name}</DialogTitle>
                <DialogDescription>{focusedProject.desc}</DialogDescription>
              </DialogHeader>
              <div className="aspect-video relative overflow-hidden rounded-lg">
                <Carousel className="w-full">
                  <CarouselContent>
                    {focusedProject.photo_url?.map((photo, i) => (
                      <CarouselItem key={i}>
                        <div className="aspect-video relative overflow-hidden rounded-lg">
                          <img
                            src={photo}
                            alt={`${focusedProject.name} - Image ${i + 1}`}
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
              <div className="flex flex-wrap gap-2">
                {focusedProject.stack?.map((tech, i) => (
                  <Badge key={i} variant="secondary">
                    {tech}
                  </Badge>
                ))}
              </div>
              <Button className="w-full" asChild>
                <a href={focusedProject.url} target="_blank" rel="noopener noreferrer">
                  Visit Site <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
}

export default ProjectRing;
