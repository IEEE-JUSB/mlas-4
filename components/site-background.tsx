"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import MoltenMetal from "./MoltenMetal";
import NeuralBackground from "./neural-background";
export default function SiteBackground() {
  // MoltenMetal touches window/WebGL, so it must only ever render on the
  // client, after mount. We also need the resolved theme before first
  // paint of the WebGL layer, so we gate both on `mounted`.
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme } = useTheme();
  useEffect(() => {
    setMounted(true);
  }, []);

  const isLight = mounted && resolvedTheme === "light";

  return (
    <div className="fixed inset-0 z-0 w-screen h-screen overflow-hidden bg-[#f2f0ef] dark:bg-black pointer-events-none">
      {/* Molten metal WebGL base */}
      <div className="absolute inset-0 w-full h-full">
        {mounted && (
          <MoltenMetal
            color1={isLight ? "#050308" : "#000000"}
            color2={isLight ? "#7c3aed" : "#c4b5fd"}
            color3={isLight ? "#22d3ee" : "#67e8f9"}
            speed={0.3}
            scale={4.5}
            detail={4}
            glow={1.5}
            coreSize={0.11}
            swirl={1.1}
            brightness={isLight ? 2.5 : 1.2}
            opacity={isLight ? 0.25 : 0.65}
            mouseInteraction
            mouseStrength={0.25}
          />
        )}
      </div>

      {/* Neural network nodes, layered on top of the molten glow. Screen
          blending only reads correctly against a dark backdrop, so it's
          swapped for a plain overlay (and a darker, higher-contrast
          palette) in light mode. */}
      <NeuralBackground
        className={
          isLight
            ? "absolute inset-0 w-full h-full opacity-40"
            : "absolute inset-0 w-full h-full opacity-60 mix-blend-screen"
        }
        colorA={isLight ? "124, 58, 237" : "168, 85, 247"}
        colorB={isLight ? "8, 145, 178" : "34, 211, 238"}
      />

      {/* Faint grid overlay, fading toward the edges */}
      <div
        className="absolute inset-0 opacity-[0.05] dark:opacity-[0.05]"
        style={{
          backgroundImage: isLight
            ? "linear-gradient(to right, #000000 1px, transparent 1px), linear-gradient(to bottom, #000000 1px, transparent 1px)"
            : "linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          maskImage:
            "radial-gradient(ellipse at center, black 0%, transparent 70%)",
          WebkitMaskImage:
            "radial-gradient(ellipse at center, black 0%, transparent 70%)",
        }}
      />
    </div>
  );
}
