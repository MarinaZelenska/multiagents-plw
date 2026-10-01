#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import { evaluateSubmission } from './score.mjs';

const args = process.argv.slice(2);
const index = args.indexOf('--submission');
if (index < 0 || !args[index + 1] || args.length !== 2) {
  console.error('Використання: npm run eval -- --submission evaluation/examples/correct.json');
  process.exitCode = 2;
} else {
  try {
    const result = evaluateSubmission(JSON.parse(readFileSync(args[index + 1], 'utf8')));
    console.log(`${result.scenarioId} — ${result.title}`);
    console.log(`Reviewer: ${result.score}/100`);
    for (const item of result.checks) console.log(`  ${item.id}: ${item.earned}/${item.points} — ${item.detail}`);
    for (const item of result.wrongLocations) console.log(`  ${item.id}: місце ${item.actual}; еталон ${item.expected}.`);
    console.log(`Ручне рев’ю: ${result.humanReview}`);
  } catch (error) {
    console.error(`Помилка формату або читання: ${error.message}`);
    process.exitCode = 2;
  }
}
