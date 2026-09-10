"use client";

import React, { useState, useEffect } from "react";

export default function SplashScreen({ onFinish }: { onFinish: () => void }) {
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    // Keep the complete splash animation to two seconds.
    const timer1 = setTimeout(() => {
      setIsFading(true);
    }, 1500);

    const timer2 = setTimeout(() => {
      onFinish();
    }, 2000);

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
        backgroundColor: "#3b0764",
        zIndex: 99999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: isFading ? 0 : 1,
        transition: "opacity 0.5s ease-in-out",
        pointerEvents: "none",
      }}
    >
      <video
        autoPlay
        muted
        playsInline
        style={{
          width: "160px",
          height: "auto",
          maxWidth: "80%",
          objectFit: "contain",
          filter: "hue-rotate(150deg)",
        }}
      >
        <source src="/off-the-wall.webm" type="video/webm" />
      </video>
    </div>
  );
}
