"use client";

import { useState } from "react";
import BeatStudio from "../components/BeatStudio";
import SplashScreen from "../components/SplashScreen";

export default function Home() {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <>
      {showSplash && <SplashScreen onFinish={() => setShowSplash(false)} />}
      <BeatStudio />
    </>
  );
}
