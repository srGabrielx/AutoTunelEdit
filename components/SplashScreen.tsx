"use client";

import React, { useState, useEffect } from "react";

export default function SplashScreen({ onFinish }: { onFinish: () => void }) {
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    // Keep it alive for a minimum time, e.g. 3.5 seconds
    const timer1 = setTimeout(() => {
      setIsFading(true);
    }, 3500);

    const timer2 = setTimeout(() => {
      onFinish();
    }, 4500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [onFinish]);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "#08080a",
        zIndex: 99999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: isFading ? 0 : 1,
        transition: "opacity 1s ease-in-out",
        pointerEvents: "none",
      }}
    >
      <video
        autoPlay
        muted
        playsInline
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      >
        <source src="/Off the Wall.webm" type="video/webm" />
      </video>
    </div>
  );
}
