import { readFile, writeFile } from 'node:fs/promises';

const path = new URL('../docs/photo-inventory.json', import.meta.url);
const manifest = JSON.parse(await readFile(path, 'utf8'));
const curation = {
  'photo-0143': { visualSubject: 'Boxer holding white gloves in a shaded outdoor training area', probableDestination: null, categories: ['people', 'portrait', 'movement'], humansVisible: true, heroPotential: false, supportingPotential: true, mood: ['focused', 'intimate', 'humid'] },
  'photo-0145': { visualSubject: 'Boxer looking through raised red gloves', probableDestination: null, categories: ['people', 'portrait', 'movement'], humansVisible: true, heroPotential: true, supportingPotential: true, mood: ['direct', 'intense', 'intimate'] },
  'photo-0176': { visualSubject: 'Pedestrians moving through a lantern-lined urban street', probableDestination: { label: 'Tokyo, Japan', confidence: 'probable', evidence: 'Visual review of streetscape and archive sequence' }, categories: ['city', 'street', 'people'], humansVisible: true, heroPotential: false, supportingPotential: true, mood: ['kinetic', 'observational', 'warm'] },
  'photo-0183': { visualSubject: 'Passengers silhouetted above churning blue ocean water', probableDestination: null, categories: ['ocean', 'people', 'movement', 'detail'], humansVisible: true, heroPotential: true, supportingPotential: true, mood: ['immersive', 'vertiginous', 'electric'] },
  'photo-0432': { visualSubject: 'Close portrait of a woman in saturated golden-hour light', probableDestination: { label: 'La Réunion, France', confidence: 'probable', evidence: 'Visual review of contiguous island sequence' }, categories: ['portrait', 'people'], humansVisible: true, heroPotential: true, supportingPotential: true, mood: ['warm', 'intimate', 'luminous'] },
  'photo-0443': { visualSubject: 'Steep green volcanic cirque beneath monumental sunlit clouds', probableDestination: { label: 'La Réunion, France', confidence: 'high', evidence: 'Recognizable cirque landscape and archive sequence' }, categories: ['landscape', 'mountain', 'nature'], humansVisible: false, heroPotential: true, supportingPotential: true, mood: ['monumental', 'cinematic', 'volatile'] },
  'photo-0487': { visualSubject: 'Small yellow bird standing on wet black volcanic rock beside flowing water', probableDestination: { label: 'La Réunion, France', confidence: 'probable', evidence: 'Contiguous island sequence' }, categories: ['nature', 'detail', 'wildlife'], humansVisible: false, heroPotential: false, supportingPotential: true, mood: ['quiet', 'observant', 'tender'] },
  'photo-0507': { visualSubject: 'Wide volcanic cirque landscape with cloud-wrapped peaks and sunlit foreground', probableDestination: { label: 'La Réunion, France', confidence: 'high', evidence: 'Recognizable cirque landscape and archive sequence' }, categories: ['landscape', 'mountain', 'nature'], humansVisible: false, heroPotential: true, supportingPotential: true, mood: ['expansive', 'cinematic', 'elemental'] },
  'photo-0529': { visualSubject: 'A lone person standing in shallow water at an orange-red lagoon sunset', probableDestination: { label: 'La Réunion, France', confidence: 'probable', evidence: 'Contiguous island sequence' }, categories: ['ocean', 'landscape', 'people'], humansVisible: true, heroPotential: true, supportingPotential: true, mood: ['still', 'luminous', 'contemplative'] },
};

for (const photo of manifest.photos) {
  if (!curation[photo.id]) continue;
  photo.editorial = {
    ...photo.editorial,
    status: 'human-reviewed-phase-one',
    ...curation[photo.id],
    notes: 'Reviewed from contact sheet and full-resolution source during Phase 1 art direction.',
  };
}

await writeFile(path, `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`Curated ${Object.keys(curation).length} Phase 1 photographs`);
