#!/bin/bash

# We will replace the entire switch blocks for each case
# We'll use node to rewrite the file to avoid regex hell

node -e '
const fs = require("fs");
let code = fs.readFileSync("workers/studio.worker.ts", "utf8");

code = code.replace(/const res = await fetch\("\/api\/melody"[\s\S]*?const data: MelodyResult = await res\.json\(\);/m, 
`const data: MelodyResult = generateMelody({
          style: p.style,
          bpm: p.bpm,
          key: p.key,
          scale: p.scale,
          complexity: p.complexity,
          seed,
        });`);

code = code.replace(/const res = await fetch\("\/api\/bass"[\s\S]*?const data: BassResult = await res\.json\(\);/m,
`const data: BassResult = await runLegacyBassPipeline({
          style: p.style,
          bpm: p.bpm,
          key: p.key,
          scale: p.scale,
          bassOctave: p.bassOctave,
          complexity: p.complexity,
          seed,
        });`);

code = code.replace(/const res = await fetch\("\/api\/drums"[\s\S]*?const data: DrumResult = await res\.json\(\);/m,
`const data: DrumResult = await runLegacyDrumsPipeline({
          style: p.style,
          bpm: p.bpm,
          drumPattern: p.drumPattern,
          complexity: p.complexity,
          swing: p.swing,
          rollDensity: p.rollDensity,
          humanize: p.humanize,
          seed,
        });`);

fs.writeFileSync("workers/studio.worker.ts", code);
'
