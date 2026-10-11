"use client";

import { useRef } from "react";

// Wraps a card's cover and plays a muted preview clip while hovered/focused.
export default function HoverVideo({
  src,
  children
}: {
  src: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLVideoElement>(null);

  function play() {
    ref.current?.play().catch(() => {});
  }
  function stop() {
    const v = ref.current;
    if (!v) return;
    v.pause();
    v.currentTime = 0;
  }

  return (
    <div
      className="absolute inset-0"
      onMouseEnter={play}
      onMouseLeave={stop}
      onFocus={play}
      onBlur={stop}
    >
      {children}
      <video
        ref={ref}
        src={src}
        muted
        loop
        playsInline
        preload="none"
        className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />
    </div>
  );
}
