import { mkdirSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';

const [, , mode, reviewId] = process.argv;

function fail(message) {
  console.error(message);
  process.exit(1);
}

if (mode === '--prepare') {
  if (!reviewId || !/^[a-z0-9][a-z0-9-]*$/.test(reviewId)) {
    fail('Usage: node .codex/scripts/flagship-review.mjs --prepare <lowercase-review-id>');
  }
  const root = resolve('artifacts/visual-review', reviewId);
  for (const directory of ['before', 'after', 'reports']) {
    mkdirSync(resolve(root, directory), { recursive: true });
  }
  console.log(`Prepared ${root}`);
  process.exit(0);
}

if (mode !== '--checks') {
  fail('Usage: node .codex/scripts/flagship-review.mjs --checks | --prepare <review-id>');
}

for (const script of ['validate:content', 'validate:exclusions', 'validate:launch']) {
  console.log(`Running npm run ${script}`);
  const result = spawnSync('npm', ['run', script], { stdio: 'inherit' });
  if (result.error) fail(result.error.message);
  if (result.status !== 0) process.exit(result.status ?? 1);
}

console.log('ELSEWHERE lightweight flagship checks passed.');
