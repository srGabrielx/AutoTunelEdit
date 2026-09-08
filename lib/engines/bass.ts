import { makeSeed, rng } from "../music/random";
import { KEYS } from "../music/styles";
import type { BassNote, BassResult, GenerateOptions } from "../music/types";
import { buildCompositionPlan, type CompositionPlan } from "../music/composition-plan";


export function generateBass(options: GenerateOptions): BassResult {
  const seed = makeSeed(options.seed);
  const random = rng(seed);
  
  const plan: CompositionPlan = options.compositionPlan ?? buildCompositionPlan(options, random);

  const rootMidi = KEYS[plan.key] ?? 60;
  const octaveOffset = options.bassOctave ?? -36;
  const bassRoot = rootMidi + octaveOffset;

  const comp = Math.min(5, Math.max(1, options.complexity || 3));
  const notes: BassNote[] = [];

  for (let bar = 0; bar < plan.timeline.bars; bar++) {
    const barStart = bar * plan.timeline.stepsPerBar;
    
    for (let beat = 0; beat < 4; beat++) {
      const beatStart = barStart + (beat * 4);
      
      const region = plan.harmonicGrid.find(r => r.startStep <= beatStart && r.endStep > beatStart) 
                     ?? plan.harmonicGrid[0];
                     
      // The exact root of the current chord
      const chordRootTone = region.chordDegrees[0];

      // Bass anchors itself to strong beats
      const anchor = plan.rhythmicAnchors.find(a => a.step === beatStart);
      const isStrongAnchor = anchor && anchor.type === "downbeat";

      if (isStrongAnchor || (anchor && random() < anchor.weight * (comp / 3))) {
        const isSlide = false; // No rolls/slides as requested
        const duration = comp >= 3 && random() > 0.5 ? 2 : 1; // Shorter and drier

        notes.push({
          step: beatStart,
          note: bassRoot + chordRootTone,
          velocity: Math.round(82 + (anchor ? anchor.weight * 18 : 8) + (random() * 8 - 4)),
          duration,
          slide: isSlide,
        });
      }

      // Syncopations / Ghost notes
      if (comp >= 3) {
        // Find syncopation anchors in this beat
        const syncAnchors = plan.rhythmicAnchors.filter(a => a.step > beatStart && a.step < beatStart + 4 && a.type === "syncopation");
        
        for (const sa of syncAnchors) {
          if (!notes.some(n => n.step === sa.step) && random() < (sa.weight * (comp / 5)) * 0.5) { // less notes for different, drier phrasing
            notes.push({
              step: sa.step,
              note: bassRoot + chordRootTone,
              velocity: Math.round(70 + (sa.weight * 14)),
              duration: 1,
              slide: false, // No rolls/slides
            });
          }
        }
      }
    }
  }

  // Ensure at least step 0 has a strong root if empty
  if (!notes.some((n) => n.step === 0)) {
    const firstRegion = plan.harmonicGrid[0];
    notes.unshift({
      step: 0,
      note: bassRoot + firstRegion.chordDegrees[0],
      velocity: 96,
      duration: 2, // Shorter duration
    });
  }

  return {
    engine: "bass",
    seed,
    style: options.style,
    bpm: options.bpm,
    key: options.key || "C",
    scale: options.scale,
    octaveOffset,
    notes: notes.sort((a, b) => a.step - b.step),
  };
}
