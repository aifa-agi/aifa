// app/components/VideoContainerTypeOne.tsx

"use client";

import React, { useRef, useEffect } from "react";

interface VideoContainerTypeOneProps {
  videoSrc?: string;
  posterSrc?: string;
}

const VideoContainerTypeOne: React.FC<VideoContainerTypeOneProps> = ({
  videoSrc = "/_static/video/a-1.mp4",
  posterSrc,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Ensure video plays automatically without sound on mount
    const video = videoRef.current;
    if (video) {
      video.muted = true;
      video.autoplay = true;
      video.playsInline = true;
      video.loop = true;
      // Try to play the video programmatically (for mobile compatibility)
      video.play().catch(() => {});
    }
  }, []);

  return (
    <section className="multitenancy safe-paddings mt-0 overflow-hidden ">
      <div className="relative overflow-hidden border-y-4 border-primary ">
        <img
          className="relative max-w-[1920px] xl:max-w-[1380px] lg:max-w-[1150px] sm:max-w-[790px] -translate-x-1/2 left-1/2"
          src="data:image/svg+xml;charset=utf-8,%3Csvg width='1920' height='474' xmlns='http://www.w3.org/2000/svg' version='1.1'%3E%3C/svg%3E"
          width="1920"
          height="474"
          alt=""
          aria-hidden="true"
        />
        {/* Video background */}
        <video
          ref={videoRef}
          className="absolute inset-0 max-w-[1920px] xl:max-w-[1380px] lg:max-w-[1150px] sm:max-w-[790px] -translate-x-1/2 left-1/2"
          width={1920}
          height={474}
          autoPlay
          muted
          playsInline
          // loop attribute is intentionally omitted
          poster={posterSrc}
          style={{ opacity: 1 }}
        >
          <source src={videoSrc} type="video/mp4" />
          {/* Optionally add a webm source if available */}
        </video>
      </div>

      <div className="relative mx-auto lg:max-w-none lg:px-8 md:px-4 max-w-[960px]  z-10 mt-14 xl:mt-[50px] xl:max-w-[704px] lg:mt-[42px] lg:pl-24 md:mt-11 sm:mt-[22px]">
        <div
          className="flex flex-col items-center text-center" // Centered on mobile, left-aligned on md+
        >
          <h2 className="text-2xl font-bold text-foreground line-clamp-1">
            AIFA
          </h2>
          <p className="mb-4 text-xl text-muted-foreground ">
            Open source Enterprise Artificial Intelligence
          </p>
          <div className="mb-4 h-px w-16 bg-primary" />{" "}
          {/* Changed to bg-border */}
          <p className="text-base text-muted-foreground">
            Build enterprise-scale AI using the best features from industry
            leaders.
          </p>
        </div>
      </div>
    </section>
  );
};

export default VideoContainerTypeOne;
