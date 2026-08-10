import type { EditorialRole } from './archive';

export interface EditorialSelection {
  filename: string;
  derivative: string;
  role: EditorialRole;
  world: 'people' | 'beaches' | 'urban' | 'jungle' | 'ocean' | 'black-and-white' | 'detail';
  destination: null;
  monochrome: boolean;
  peoplePresent: boolean;
  emotionalIntensity: 1 | 2 | 3 | 4 | 5;
  heroPotential: 1 | 2 | 3 | 4 | 5;
  visualRhythmUse: 'expansion' | 'intimacy' | 'transition' | 'pause' | 'continuity';
  surfaces: string[];
}

// This is an authored selection, not a claim of complete archive classification.
// Geographic fields remain null until verified independently.
export const editorialSelection: EditorialSelection[] = [
  { filename: 'P1300187.jpg', derivative: 'island-of-clouds.jpg', role: 'hero', world: 'jungle', destination: null, monochrome: false, peoplePresent: false, emotionalIntensity: 5, heroPotential: 5, visualRhythmUse: 'expansion', surfaces: ['home'] },
  { filename: 'P1260635.jpg', derivative: 'people-worker.jpg', role: 'editorial', world: 'people', destination: null, monochrome: false, peoplePresent: true, emotionalIntensity: 4, heroPotential: 3, visualRhythmUse: 'continuity', surfaces: ['home', 'people'] },
  { filename: 'IMG_6647.jpg', derivative: 'beach-storm.jpg', role: 'anchor', world: 'beaches', destination: null, monochrome: false, peoplePresent: false, emotionalIntensity: 4, heroPotential: 4, visualRhythmUse: 'expansion', surfaces: ['home'] },
  { filename: 'P1230481.jpg', derivative: 'tokyo-street.jpg', role: 'editorial', world: 'urban', destination: null, monochrome: false, peoplePresent: true, emotionalIntensity: 4, heroPotential: 3, visualRhythmUse: 'continuity', surfaces: ['home'] },
  { filename: '1170554.jpg', derivative: 'jungle-roots.jpg', role: 'anchor', world: 'jungle', destination: null, monochrome: false, peoplePresent: false, emotionalIntensity: 4, heroPotential: 4, visualRhythmUse: 'pause', surfaces: ['home'] },
  { filename: 'P1230676.jpg', derivative: 'ocean-silhouettes.jpg', role: 'anchor', world: 'ocean', destination: null, monochrome: false, peoplePresent: true, emotionalIntensity: 5, heroPotential: 4, visualRhythmUse: 'expansion', surfaces: ['home'] },
  { filename: 'P1230662.jpg', derivative: 'ocean-current.jpg', role: 'editorial', world: 'ocean', destination: null, monochrome: false, peoplePresent: false, emotionalIntensity: 4, heroPotential: 3, visualRhythmUse: 'transition', surfaces: ['home'] },
  { filename: 'P1230972.jpg', derivative: 'hand-shell.jpg', role: 'detail', world: 'detail', destination: null, monochrome: true, peoplePresent: true, emotionalIntensity: 3, heroPotential: 1, visualRhythmUse: 'pause', surfaces: ['home'] },
  { filename: 'P1270203.jpg', derivative: 'cirque-portrait.jpg', role: 'anchor', world: 'jungle', destination: null, monochrome: false, peoplePresent: false, emotionalIntensity: 5, heroPotential: 5, visualRhythmUse: 'expansion', surfaces: ['home'] },
  { filename: 'P1260122.jpg', derivative: 'bw-horizon.jpg', role: 'anchor', world: 'black-and-white', destination: null, monochrome: true, peoplePresent: true, emotionalIntensity: 4, heroPotential: 5, visualRhythmUse: 'expansion', surfaces: ['home', 'black-and-white'] },
  { filename: 'IMG_0442.jpg', derivative: 'bw-market-woman.jpg', role: 'anchor', world: 'black-and-white', destination: null, monochrome: true, peoplePresent: true, emotionalIntensity: 5, heroPotential: 4, visualRhythmUse: 'intimacy', surfaces: ['home', 'people', 'black-and-white'] },
  { filename: '1200794-3.jpg', derivative: 'bw-joy-reflection.jpg', role: 'editorial', world: 'black-and-white', destination: null, monochrome: true, peoplePresent: true, emotionalIntensity: 4, heroPotential: 3, visualRhythmUse: 'continuity', surfaces: ['black-and-white'] },
  { filename: 'P1240171.jpg', derivative: 'bw-small-boat.jpg', role: 'anchor', world: 'black-and-white', destination: null, monochrome: true, peoplePresent: true, emotionalIntensity: 4, heroPotential: 4, visualRhythmUse: 'pause', surfaces: ['home', 'black-and-white'] },
  { filename: 'P1240815.jpg', derivative: 'bw-doorway-man.jpg', role: 'editorial', world: 'black-and-white', destination: null, monochrome: true, peoplePresent: true, emotionalIntensity: 4, heroPotential: 3, visualRhythmUse: 'intimacy', surfaces: ['black-and-white'] },
  { filename: 'P1250928.jpg', derivative: 'bw-reach-sun.jpg', role: 'detail', world: 'black-and-white', destination: null, monochrome: true, peoplePresent: true, emotionalIntensity: 4, heroPotential: 3, visualRhythmUse: 'transition', surfaces: ['black-and-white'] },
  { filename: 'P1260197.jpg', derivative: 'bw-prayer.jpg', role: 'editorial', world: 'black-and-white', destination: null, monochrome: true, peoplePresent: false, emotionalIntensity: 4, heroPotential: 3, visualRhythmUse: 'pause', surfaces: ['black-and-white'] },
  { filename: 'P1260426.jpg', derivative: 'bw-city-taxis.jpg', role: 'anchor', world: 'black-and-white', destination: null, monochrome: true, peoplePresent: false, emotionalIntensity: 4, heroPotential: 4, visualRhythmUse: 'expansion', surfaces: ['black-and-white'] },
  { filename: 'P1260472-2.jpg', derivative: 'bw-upward.jpg', role: 'editorial', world: 'black-and-white', destination: null, monochrome: true, peoplePresent: true, emotionalIntensity: 4, heroPotential: 3, visualRhythmUse: 'continuity', surfaces: ['black-and-white'] },
  { filename: 'P1310083.jpg', derivative: 'lagoon-sunset.jpg', role: 'editorial', world: 'ocean', destination: null, monochrome: false, peoplePresent: true, emotionalIntensity: 4, heroPotential: 3, visualRhythmUse: 'transition', surfaces: ['home'] },
  { filename: 'P1040004.jpg', derivative: 'fern-spiral.jpg', role: 'detail', world: 'jungle', destination: null, monochrome: false, peoplePresent: false, emotionalIntensity: 2, heroPotential: 1, visualRhythmUse: 'pause', surfaces: ['home'] },
  { filename: 'P1280352.jpg', derivative: 'yellow-bird.jpg', role: 'detail', world: 'jungle', destination: null, monochrome: false, peoplePresent: false, emotionalIntensity: 3, heroPotential: 2, visualRhythmUse: 'pause', surfaces: ['home'] },
  { filename: 'P1210859.jpg', derivative: 'boxing-gloves.jpg', role: 'editorial', world: 'people', destination: null, monochrome: false, peoplePresent: true, emotionalIntensity: 4, heroPotential: 3, visualRhythmUse: 'continuity', surfaces: ['home'] },
  { filename: 'P1270057-2.jpg', derivative: 'golden-portrait.jpg', role: 'editorial', world: 'people', destination: null, monochrome: false, peoplePresent: true, emotionalIntensity: 4, heroPotential: 3, visualRhythmUse: 'intimacy', surfaces: ['people'] },
];
