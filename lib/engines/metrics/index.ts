import type { CompositionState } from '../../core/state/composition.ts';
import type { StrictGenerationPlan } from '../../director/planner/index.ts';

export function calculateMetrics(_state: CompositionState, _plan: StrictGenerationPlan) {
  const voiceLeadingScore = 1.0;
  const harmonicCohesionScore = 1.0;
  const rhythmicDensityScore = 1.0;

  return {
    voiceLeadingScore,
    harmonicCohesionScore,
    rhythmicDensityScore
  };
}
