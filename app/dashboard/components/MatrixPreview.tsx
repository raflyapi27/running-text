import React, { useMemo } from "react";
import { LayoutType } from "./LayoutSelector";
import { ZoneData } from "./RunningTextSection";

type Props = {
  layout: LayoutType;
  zones: ZoneData[];
  speed: number;
  brightness: number;
};

const LED_SIZE = 4; // Smaller size for higher resolution look

export function MatrixPreview({ layout, zones, speed, brightness }: Props) {
  // Convert 0-255 brightness to 0-1 opacity/filter
  const brightnessStyle = {
    filter: `brightness(${0.5 + (brightness / 255) * 1.5})`, // Scale 0.5 to 2.0
    opacity: 0.8 + (brightness / 255) * 0.2,
  };

  // Speed calculation
  // const animationDuration = `${Math.max(0.5, speed * 0.1)}s`; // Moved to Zone

  return (
    <div className="w-full mb-6 rounded-lg border border-zinc-800 bg-zinc-950 p-4 shadow-inner">
      <div className="relative mx-auto overflow-hidden bg-black rounded border-4 border-zinc-900 shadow-2xl"
           style={{
             height: "128px", // Adjusted for 32px height panel ratio (e.g. 32 * 4px)
             width: "100%",
             maxWidth: "640px", 
           }}
      >
        {/* LED Grid Overlay - Creates the dot matrix look */}
        <div 
          className="absolute inset-0 z-20 pointer-events-none"
          style={{
            // Increase transparency area to make dots clearer
            backgroundImage: "radial-gradient(circle, transparent 35%, #000 50%)",
            backgroundSize: `${LED_SIZE}px ${LED_SIZE}px`,
            backgroundPosition: "center",
          }}
        />
        
        {/* Content Layer */}
        <div className="absolute inset-0 z-10 flex w-full h-full" style={brightnessStyle}>
          {renderLayout(layout, zones, speed)}
        </div>
        
        {/* Glow/Reflection Effect */}
        <div className="absolute inset-0 z-30 pointer-events-none bg-gradient-to-b from-white/5 to-transparent rounded" />
      </div>
      
      {/* Styles for custom animations */}
      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        @keyframes bounce-x {
          0% { transform: translateX(100%); }
          50% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes snake-y {
          0%, 100% { transform: translateY(0); }
          25% { transform: translateY(4px); }
          75% { transform: translateY(-4px); }
        }
        @keyframes blink {
          0%, 50% { opacity: 1; }
          50.1%, 100% { opacity: 0; }
        }
        @keyframes typing {
          from { width: 0 }
          to { width: 100% }
        }
      `}</style>
    </div>
  );
}

function renderLayout(layout: LayoutType, zones: ZoneData[], speed: number) {
  const getZone = (index: number) => zones[index] || { text: "", animation: "none" };

  switch (layout) {
    case "split-h":
      return (
        <div className="flex flex-col w-full h-full">
          <Zone content={getZone(0)} speed={speed} className="h-1/2 border-b border-zinc-900/50" />
          <Zone content={getZone(1)} speed={speed} className="h-1/2" />
        </div>
      );
    case "split-v":
      return (
        <div className="flex w-full h-full">
          <Zone content={getZone(0)} speed={speed} className="w-1/2 border-r border-zinc-900/50" />
          <Zone content={getZone(1)} speed={speed} className="w-1/2" />
        </div>
      );
    case "left-big":
      return (
        <div className="flex w-full h-full">
          <Zone content={getZone(0)} speed={speed} className="w-2/3 border-r border-zinc-900/50" />
          <div className="flex flex-col w-1/3 h-full">
            <Zone content={getZone(1)} speed={speed} className="h-1/2 border-b border-zinc-900/50" />
            <Zone content={getZone(2)} speed={speed} className="h-1/2" />
          </div>
        </div>
      );
    case "right-big":
      return (
        <div className="flex w-full h-full">
          <div className="flex flex-col w-1/3 h-full border-r border-zinc-900/50">
            <Zone content={getZone(0)} speed={speed} className="h-1/2 border-b border-zinc-900/50" />
            <Zone content={getZone(1)} speed={speed} className="h-1/2" />
          </div>
          <Zone content={getZone(2)} speed={speed} className="w-2/3" />
        </div>
      );
    case "default":
    default:
      return <Zone content={getZone(0)} speed={speed} className="w-full h-full" />;
  }
}

function Zone({ content, speed, className }: { content: ZoneData; speed: number; className?: string }) {
  const { text, animation, border } = content;
  
  const isMoving = ["slide", "snake", "bounce"].includes(animation);

  const animStyle = useMemo(() => {
    const moveDuration = `${Math.max(0.5, speed * 0.1)}s`;
    const blinkDuration = `${Math.max(0.1, speed * 0.01)}s`; // 10x faster for blink

    if (animation === "slide") {
      return { animation: `marquee ${moveDuration} linear infinite` };
    }
    if (animation === "snake") {
      return { animation: `marquee ${moveDuration} linear infinite` };
    }
    if (animation === "bounce") {
      return { animation: `bounce-x ${moveDuration} linear infinite` };
    }
    if (animation === "blink") {
      // Pastikan hanya opacity yang berubah, tanpa scale/transform
      return { animation: `blink ${blinkDuration} step-start infinite` };
    }
    if (animation === "typing") {
      return {
        animation: `typing ${moveDuration} steps(40, end) infinite`,
        overflow: "hidden",
        whiteSpace: "nowrap",
        display: "inline-block",
      };
    }
    return {};
  }, [animation, speed]);

  const textStyle = {
    color: "#ff0000",
    textShadow: "0 0 4px rgba(255, 0, 0, 0.8), 0 0 8px rgba(255, 0, 0, 0.4)",
  };

  const textInnerStyle =
    animation === "snake"
      ? {
          animation: `snake-y 0.5s ease-in-out infinite`,
          display: "inline-block",
        }
      : {};

  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden bg-black ${className}`}
    >
      {border && (
        <div 
          className="absolute inset-0 z-10 pointer-events-none"
          style={{ 
            border: "4px solid #ff0000",
            boxShadow: "0 0 4px rgba(255, 0, 0, 0.8), inset 0 0 4px rgba(255, 0, 0, 0.8)" 
          }}
        />
      )}
      {isMoving ? (
        <div className="w-full h-full flex items-center overflow-hidden">
          <div
            style={{
              ...animStyle,
              ...textStyle,
              whiteSpace: "nowrap",
              minWidth: "100%",
              textAlign: "center",
            }}
            className="font-sans font-black text-8xl tracking-widest"
          >
            <span style={textInnerStyle}>
              {text ? text.toUpperCase() : " "}
            </span>
          </div>
        </div>
      ) : (
        <div
          style={{ ...animStyle, ...textStyle }}
          className={`font-sans font-black text-8xl tracking-widest text-center px-4 whitespace-nowrap`}
        >
          {text ? text.toUpperCase() : " "}
        </div>
      )}
    </div>
  );
}
