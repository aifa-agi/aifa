"use client";

import type React from "react";
import { useState, useEffect, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";

export interface HorizontalStepData {
  id: string;
  title: string;
  description: string;
  imageSrc: string;
}

// Новый объект Props теперь принимает title и description
export interface HorizontalStepsProps {
  steps: HorizontalStepData[];
  title: string;
  description: string;
  className?: string;
}

export const HorizontalSteps: React.FC<HorizontalStepsProps> = ({
  steps,
  title,
  description,
  className,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [imageOpacity, setImageOpacity] = useState(1);
  const [progressWidth, setProgressWidth] = useState(0); // 0 to 100 for line animation
  const lineAnimationFrameRef = useRef<number | null>(null); // Ref for line animation frame
  const lastLineTimeRef = useRef<number>(0); // Last timestamp for line animation
  const lineStartTimeRef = useRef<number>(0); // Start time of the current 15s line cycle

  const totalSteps = steps.length;
  const stepSwitchDuration = 5000; // 5 seconds for step content switch
  const lineAnimationDuration = 15000; // 15 seconds for full line animation
  const fadeDuration = 700; // 700ms for image/content fade

  // Line animation logic
  const animateLine = useCallback(
    (currentTime: number) => {
      if (!lastLineTimeRef.current) lastLineTimeRef.current = currentTime;
      if (!lineStartTimeRef.current) lineStartTimeRef.current = currentTime;

      const elapsedSinceCycleStart = currentTime - lineStartTimeRef.current;

      // Calculate progress for the line based on lineAnimationDuration
      let newProgress = (elapsedSinceCycleStart / lineAnimationDuration) * 100;

      if (newProgress >= 100) {
        newProgress = 100; // Cap at 100%
        // Reset line animation cycle
        setProgressWidth(0); // Reset to 0 for the next cycle
        lineStartTimeRef.current = currentTime; // Start new cycle
        lastLineTimeRef.current = currentTime; // Reset last time for next frame
        lineAnimationFrameRef.current = requestAnimationFrame(animateLine); // Continue animation
      } else {
        setProgressWidth(newProgress);
        lastLineTimeRef.current = currentTime;
        lineAnimationFrameRef.current = requestAnimationFrame(animateLine);
      }
    },
    [lineAnimationDuration]
  );

  useEffect(() => {
    // Start the continuous line animation
    lineAnimationFrameRef.current = requestAnimationFrame(animateLine);

    // Set up interval for step content switching
    const stepInterval = setInterval(() => {
      setImageOpacity(0); // Start fade out
      setTimeout(() => {
        setCurrentStepIndex((prevIndex) => (prevIndex + 1) % totalSteps);
        setImageOpacity(1); // Fade in new content
      }, fadeDuration);
    }, stepSwitchDuration);

    return () => {
      // Cleanup
      if (lineAnimationFrameRef.current)
        cancelAnimationFrame(lineAnimationFrameRef.current);
      clearInterval(stepInterval);
    };
  }, [totalSteps, stepSwitchDuration, fadeDuration, animateLine]);

  const currentStep = steps[currentStepIndex];

  // Calculate circle positions
  const getCircleLeft = (index: number) => {
    if (totalSteps === 3) {
      if (index === 0) return "60px";
      if (index === 1) return "calc((60px + (100% - 25%)) / 2)";
      if (index === 2) return "calc(100% - 25%)";
    }
    // Fallback for other numbers of steps or general distribution
    return `${(index / (totalSteps - 1)) * 100}%`;
  };

  const getCircleLeftMobile = (index: number) => {
    if (totalSteps === 3) {
      if (index === 0) return "60px";
      if (index === 1) return "50%";
      if (index === 2) return "calc(100% - 60px)";
    }
    return `${(index / (totalSteps - 1)) * 100}%`;
  };

  return (
    <section className="w-full mt-20 ">
      <div className="flex flex-col items-center px-4">
        <h2 className="mb-6 max-w-3xl font-serif text-center text-xl font-bold leading-tight md:text-2xl lg:text-4xl ">
          {title}
        </h2>
        <p className="mb-12 max-w-xl text-base text-center text-muted-foreground md:text-lg">
          {description}
        </p>
      </div>
      <div className={cn("w-full  py-8", className)}>
        {/* Top Image Section */}
        <div className="relative w-full aspect-[16/9] max-w-4xl mx-auto mb-8 rounded-lg overflow-hidden border border-gray-800">
          {steps.map((step, index) => (
            <Image
              key={step.id}
              src={step.imageSrc || "/placeholder.svg"}
              alt={`Step ${index + 1} image`}
              layout="fill"
              objectFit="cover"
              className={cn("transition-opacity duration-700", {
                "opacity-100": index === currentStepIndex && imageOpacity === 1,
                "opacity-0": index !== currentStepIndex || imageOpacity === 0,
              })}
            />
          ))}
        </div>

        {/* Horizontal Step Indicator */}
        <div className="relative w-full max-w-4xl mx-auto px-4 mb-8">
          {/* Container for lines with gradient mask */}
          <div
            className="absolute top-1/2 left-0 right-0 h-px transform -translate-y-1/2 mx-auto"
            style={{
              maskImage: `linear-gradient(to right, transparent 0%, black 60px, black calc(100% - 60px), transparent 100%)`,
              WebkitMaskImage: `linear-gradient(to right, transparent 0%, black 60px, black calc(100% - 60px), transparent 100%)`,
            }}
          >
            {/* Base Line */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gray-700" />

            {/* Animated Progress Line */}
            <div
              className="absolute top-0 left-[60px] h-px bg-primary"
              style={{
                width: `${progressWidth}%`,
                transition: "width 0.1s linear",
              }}
            />
          </div>

          {/* Step Circles */}
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={cn(
                "absolute top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10",
                "md:left-[var(--desktop-left)]",
                "left-[var(--mobile-left)]"
              )}
              style={
                {
                  "--desktop-left": getCircleLeft(index),
                  "--mobile-left": getCircleLeftMobile(index),
                } as React.CSSProperties
              }
            >
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 border",
                  "bg-gray-800 text-gray-300 border-gray-600",
                  {
                    "border-primary bg-gray-800 text-primary":
                      index === currentStepIndex,
                  }
                )}
              >
                {index + 1}
              </div>
            </div>
          ))}
        </div>

        {/* Content Section */}
        <div className="w-full max-w-4xl mx-auto px-4 mt-[60px]">
          {/* Desktop View: All content visible */}
          <div className="hidden md:flex justify-between gap-8">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={cn(
                  "flex-1 text-center transition-all duration-300",
                  {
                    "opacity-100": index === currentStepIndex,
                    "opacity-60 blur-sm": index !== currentStepIndex,
                  }
                )}
              >
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-gray-400 text-sm">{step.description}</p>
              </div>
            ))}
          </div>
          {/* Mobile View: Only active content visible */}
          <div className="md:hidden text-center">
            <div
              className={cn("transition-opacity duration-700", {
                "opacity-100": imageOpacity === 1,
                "opacity-0": imageOpacity === 0,
              })}
            >
              <h3 className="text-xl font-semibold mb-2">
                {currentStep.title}
              </h3>
              <p className="text-gray-400 text-sm">{currentStep.description}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
