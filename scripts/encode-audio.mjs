// Encodes the nine hour recordings into the files the app downloads (mono MP3, 64 kbps, 1 dB of headroom).
// usage: node scripts/encode-audio.mjs "<folder with the original recordings>" [output folder (default audio-out)] [--dry-run]
// needs ffmpeg on the PATH. Upload the resulting prime.mp3 ... mid3.mp3 to the host used by EXPO_PUBLIC_AUDIO_BASE_URL.
import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

// hour id -> words that identify its original file name (Arabic names of the choir's recordings)
export const MATCHERS = {
  prime: ['باكر'], terce: ['الساعة الثالثة'], sext: ['الساعة السادسة'], none: ['الساعة التاسعة'], vespers: ['الغروب'], compline: ['النوم'],
  mid1: ['نصف الليل', 'الأولى'], mid2: ['نصف الليل', 'الثانية'], mid3: ['نصف الليل', 'الثالثة']
};

export function findSource(files, words) {
  const hits = files.filter(name => name.toLowerCase().endsWith('.mp3') && words.every(word => name.includes(word)));
  return hits.length === 1 ? hits[0] : null;
}

export function ffmpegArgs(input, output) {
  return ['-y', '-i', input, '-vn', '-ac', '1', '-ar', '44100', '-af', 'alimiter=limit=0.89:level=false', '-c:a', 'libmp3lame', '-b:a', '64k', output];
}

function main(argv) {
  const dry = argv.includes('--dry-run');
  const [inDir, outDir = 'audio-out'] = argv.filter(a => !a.startsWith('--'));
  if (!inDir || !existsSync(inDir)) { console.error('Give the folder that holds the original recordings.'); process.exit(1); }
  const files = readdirSync(inDir);
  if (!dry) mkdirSync(outDir, { recursive: true });
  let failed = 0;
  for (const [id, words] of Object.entries(MATCHERS)) {
    const source = findSource(files, words);
    if (!source) { console.error(`${id}: no single matching file for [${words.join(' + ')}]`); failed++; continue; }
    const target = join(outDir, `${id}.mp3`);
    console.log(`${id}: ${source} -> ${target}`);
    if (dry) continue;
    const run = spawnSync('ffmpeg', ffmpegArgs(join(inDir, source), target), { stdio: 'inherit' });
    if (run.status !== 0) { console.error(`${id}: ffmpeg failed`); failed++; }
  }
  process.exit(failed ? 1 : 0);
}

import { pathToFileURL } from 'node:url';
if (import.meta.url === pathToFileURL(process.argv[1]).href) main(process.argv.slice(2));
