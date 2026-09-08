import { makeSeed, rng } from "../music/random";
import type { GenerateOptions, MelodyResult } from "../music/types";
import { runMelodyPipeline } from "./melody-pipeline";

export function generateMelody(options: GenerateOptions): MelodyResult {
  const seed = makeSeed(options.seed);
  const random = rng(seed);

  const notes = runMelodyPipeline(options, random);

  return {
    engine: "melody",
    seed,
    style: options.style,
    bpm: options.bpm,
    key: options.key || "C",
    scale: options.scale,
    notes,
  };
}

