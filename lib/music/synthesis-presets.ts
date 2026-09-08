import type { BassDrive, DrumKitMode, MelodySynthType, StyleId } from "./types";

/**
 * High-Fidelity Synthesis Presets (Single Source of Truth)
 * Shared between Web Audio Live Transport and Worker DSP WAV Renderer.
 */

export interface DrumKitSynthConfig {
  hatInharmonicFreqs: number[];
  hatMetalRatio: number;
  hatNoiseRatio: number;
  hatFilterCutoff: number;
  openHatCutoff: number;
  snareBodyFreq: number;
  snareNoiseCutoff: number;
  clapCenterFreq: number;
  kickTransientFreq: number;
  kickSubFreq: number;
}

export const DRUM_KIT_SYNTH_CONFIGS: Record<DrumKitMode, DrumKitSynthConfig> = {
  "trap-808": {
    // Classic TR-808 inharmonic metallic square wave bank with smooth filtering
    hatInharmonicFreqs: [245, 306, 384, 422, 659, 866],
    hatMetalRatio: 0.48,
    hatNoiseRatio: 0.52,
    hatFilterCutoff: 7000,
    openHatCutoff: 5800,
    snareBodyFreq: 185,
    snareNoiseCutoff: 3200,
    clapCenterFreq: 1400,
    kickTransientFreq: 175,
    kickSubFreq: 48,
  },
  "drill-punch": {
    // Sharp transient snap with controlled top-end to prevent clipping
    hatInharmonicFreqs: [290, 395, 480, 620, 780, 940],
    hatMetalRatio: 0.54,
    hatNoiseRatio: 0.46,
    hatFilterCutoff: 7400,
    openHatCutoff: 6400,
    snareBodyFreq: 210,
    snareNoiseCutoff: 3800,
    clapCenterFreq: 1550,
    kickTransientFreq: 195,
    kickSubFreq: 52,
  },
  "funk-tamborzao": {
    // Punchy acoustic/sampled simulation with warmer mids
    hatInharmonicFreqs: [220, 330, 440, 580, 720, 880],
    hatMetalRatio: 0.45,
    hatNoiseRatio: 0.55,
    hatFilterCutoff: 6800,
    openHatCutoff: 5600,
    snareBodyFreq: 225,
    snareNoiseCutoff: 2800,
    clapCenterFreq: 1300,
    kickTransientFreq: 165,
    kickSubFreq: 55,
  },
  "boom-bap": {
    // Gritty, vintage filtered character
    hatInharmonicFreqs: [205, 310, 415, 540, 690, 820],
    hatMetalRatio: 0.50,
    hatNoiseRatio: 0.50,
    hatFilterCutoff: 6000,
    openHatCutoff: 5200,
    snareBodyFreq: 195,
    snareNoiseCutoff: 2600,
    clapCenterFreq: 1250,
    kickTransientFreq: 150,
    kickSubFreq: 60,
  },
  "amapiano-log": {
    // Mellow percussion and organic shaker/woodblock hats
    hatInharmonicFreqs: [260, 370, 490, 610, 740, 910],
    hatMetalRatio: 0.35,
    hatNoiseRatio: 0.65,
    hatFilterCutoff: 6400,
    openHatCutoff: 5400,
    snareBodyFreq: 170,
    snareNoiseCutoff: 2400,
    clapCenterFreq: 1350,
    kickTransientFreq: 140,
    kickSubFreq: 46,
  },
};

export interface MelodySynthVoiceConfig {
  voiceCount: number;
  detuneCents: number;
  gainCompensation: number; // 1 / Math.sqrt(voiceCount)
  filterStartCutoff: number;
  filterEndCutoff: number;
  filterQ: number;
  decayExp: number;
  osc1Type: OscillatorType;
  osc2Type: OscillatorType;
  baseVol: number;
}

export function getMelodySynthConfig(synthType: MelodySynthType, style: StyleId = "trap-br"): MelodySynthVoiceConfig {
  const isDarkTrap = style === "trap-uk" || style === "trap-usa" || style === "trap-br";
  const voiceCount = 2;
  const gainCompensation = 1 / Math.sqrt(voiceCount); // ~0.707

  switch (synthType) {
    case "lead":
      return {
        voiceCount,
        detuneCents: isDarkTrap ? 8 : 6,
        gainCompensation,
        filterStartCutoff: 2600,
        filterEndCutoff: 320,
        filterQ: 1.6,
        decayExp: 3.8,
        osc1Type: "sawtooth",
        osc2Type: "sawtooth",
        baseVol: 0.19,
      };
    case "pad":
      return {
        voiceCount,
        detuneCents: 8,
        gainCompensation,
        filterStartCutoff: 1800,
        filterEndCutoff: 280,
        filterQ: 1.2,
        decayExp: 2.0,
        osc1Type: "sawtooth",
        osc2Type: "triangle",
        baseVol: 0.22,
      };
    case "pluck":
      return {
        voiceCount,
        detuneCents: 5,
        gainCompensation,
        filterStartCutoff: 3000,
        filterEndCutoff: 340,
        filterQ: 1.8,
        decayExp: 5.0,
        osc1Type: "sawtooth",
        osc2Type: "sine",
        baseVol: 0.20,
      };
    case "arp":
      return {
        voiceCount,
        detuneCents: 6,
        gainCompensation,
        filterStartCutoff: 2600,
        filterEndCutoff: 320,
        filterQ: 1.7,
        decayExp: 4.2,
        osc1Type: "sawtooth",
        osc2Type: "sawtooth",
        baseVol: 0.19,
      };
    case "brass":
      return {
        voiceCount: 3, // Fat brass needs more voices
        detuneCents: 12,
        gainCompensation: 1 / Math.sqrt(3),
        filterStartCutoff: 4500,
        filterEndCutoff: 800,
        filterQ: 1.1,
        decayExp: 2.5,
        osc1Type: "sawtooth",
        osc2Type: "square",
        baseVol: 0.25,
      };
    case "keys":
      return {
        voiceCount: 2,
        detuneCents: 3,
        gainCompensation,
        filterStartCutoff: 2000,
        filterEndCutoff: 400,
        filterQ: 1.3,
        decayExp: 3.5,
        osc1Type: "triangle",
        osc2Type: "sine",
        baseVol: 0.28,
      };
    case "bell":
      return {
        voiceCount: 2,
        detuneCents: 15, // Inharmonic partials
        gainCompensation,
        filterStartCutoff: 8000,
        filterEndCutoff: 1200,
        filterQ: 2.0,
        decayExp: 6.0,
        osc1Type: "sine",
        osc2Type: "square", // Will be heavily filtered
        baseVol: 0.22,
      };
    case "flute":
      return {
        voiceCount: 2,
        detuneCents: 4,
        gainCompensation,
        filterStartCutoff: 1800,
        filterEndCutoff: 1200,
        filterQ: 1.2,
        decayExp: 2.0,
        osc1Type: "sine",
        osc2Type: "triangle",
        baseVol: 0.30,
      };
    case "strings":
      return {
        voiceCount: 3,
        detuneCents: 10,
        gainCompensation: 1 / Math.sqrt(3),
        filterStartCutoff: 3500,
        filterEndCutoff: 1800,
        filterQ: 1.0,
        decayExp: 1.5,
        osc1Type: "sawtooth",
        osc2Type: "sawtooth",
        baseVol: 0.18,
      };
    case "choir":
      return {
        voiceCount: 3,
        detuneCents: 14,
        gainCompensation: 1 / Math.sqrt(3),
        filterStartCutoff: 2200,
        filterEndCutoff: 800,
        filterQ: 0.8,
        decayExp: 1.2,
        osc1Type: "triangle",
        osc2Type: "sawtooth",
        baseVol: 0.20,
      };
  }
}

export interface Bass808SynthConfig {
  cleanSubGain: number;      // Preserves pure fundamental for physical subwoofers
  parallelSatGain: number;   // Upper harmonic saturation for mobile/small speakers
  pitchDiveStartMultiplier: number;
  pitchDiveDurationSec: number;
  harmonicCutoffHz: number;  // Lowpass filter cutoff to eliminate high-pitched buzz
}

export const BASS_808_CONFIGS: Record<BassDrive, Bass808SynthConfig> = {
  clean: {
    cleanSubGain: 0.96,
    parallelSatGain: 0.04,
    pitchDiveStartMultiplier: 1.08,
    pitchDiveDurationSec: 0.015,
    harmonicCutoffHz: 120, // Reduced from 180 (less treble/agudos)
  },
  warm: {
    cleanSubGain: 0.90,
    parallelSatGain: 0.08,
    pitchDiveStartMultiplier: 1.12,
    pitchDiveDurationSec: 0.020,
    harmonicCutoffHz: 180, // Reduced from 260
  },
  overdrive: {
    cleanSubGain: 0.85,
    parallelSatGain: 0.15,
    pitchDiveStartMultiplier: 1.15,
    pitchDiveDurationSec: 0.025,
    harmonicCutoffHz: 200, // Reduced from 340
  },
};

/**
 * Shared output-stage defaults. Keeping these separate from the tone presets
 * lets both realtime and offline renderers apply the same headroom policy
 * without changing the sound-design values above.
 */
export const BASS_808_MIX_CONFIG = {
  baseGain: 0.8,
  outputHighpassHz: 24,
  outputLowpassHz: 190,
  outputFilterQ: 0.65,
  chokeReleaseSec: 0.012,
} as const;

export const HAT_MIX_CONFIG = {
  closedGain: 0.075,
  openGain: 0.09,
  closedMaxDurationSec: 0.06,
  openDurationSec: 0.18,
  closedLowpassHz: 12_000,
  openLowpassHz: 11_500,
  busGain: 0.9,
  compressorThresholdDb: -14,
  compressorKneeDb: 6,
  compressorRatio: 6,
  compressorAttackSec: 0.001,
  compressorReleaseSec: 0.04,
  maxVoices: 3,
  chokeReleaseSec: 0.008,
} as const;

export const MASTER_BUS_CONFIG = {
  dcBlockerR: 0.995,
  softClipThreshold: 0.82,
  peakCeiling: 0.89125, // -1.0 dBFS to prevent inter-sample clipping and ensure safe headroom
};
