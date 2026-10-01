import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';
import { evaluateSubmission, loadGolden } from './score.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const example = name => JSON.parse(readFileSync(new URL(`./examples/${name}.json`, import.meta.url), 'utf8'));

function canonical(caseData) {
  return {
    scenarioId: caseData.id,
    verdict: caseData.verdict,
    findings: caseData.findings.map(finding => {
      const lines = readFileSync(path.join(root, caseData.fixture, finding.file), 'utf8').split(/\r?\n/);
      return {
        id: finding.id,
        file: finding.file,
        line: lines.findIndex(line => line.trim() === finding.anchor.trim()) + 1,
        problem: finding.rule,
        impact: finding.impact,
        fix: finding.fix
      };
    })
  };
}

test('усі шість еталонів мають доступні унікальні місця і дають 100/100', () => {
  const golden = loadGolden();
  assert.deepEqual(golden.cases.map(item => item.id),
    ['REV-01', 'REV-02', 'REV-03', 'REV-04', 'REV-05', 'REV-06']);
  for (const caseData of golden.cases) {
    for (const finding of caseData.findings) {
      const lines = readFileSync(path.join(root, caseData.fixture, finding.file), 'utf8').split(/\r?\n/);
      assert.equal(lines.filter(line => line.trim() === finding.anchor.trim()).length, 1, finding.id);
    }
    assert.equal(evaluateSubmission(canonical(caseData)).score, 100, caseData.id);
  }
});

test('приклад повного рев’ю знаходить обидві проблеми Page Object', () => {
  const result = evaluateSubmission(example('correct'));
  assert.equal(result.score, 100);
  assert.deepEqual(result.missed, []);
  assert.deepEqual(evaluateSubmission(example('correct')), result);
});

test('окремий приклад знаходить XPath у локаторі', () => {
  assert.equal(evaluateSubmission(example('locator')).score, 100);
});

test('неповне рев’ю втрачає бали за пропуск, зайву проблему, місце й вердикт', () => {
  const result = evaluateSubmission(example('broken'));
  assert.equal(result.score, 35);
  assert.deepEqual(result.missed.map(item => item.id), ['POM_HIDDEN_ASSERTION']);
  assert.deepEqual(result.extra, ['CLASS_NAME']);
  assert.deepEqual(result.wrongLocations.map(item => item.id), ['POM_CONSTRUCTOR_ACTION']);
});

test('чистий контрольний приклад карає хибнопозитивне зауваження', () => {
  const answer = canonical(loadGolden().cases[0]);
  assert.equal(evaluateSubmission(answer).score, 100);
  answer.findings.push({ id: 'FAKE', file: 'pages/home.page.ts', line: 3,
    problem: 'Неіснуюче порушення.', impact: 'Непідтверджений наслідок.', fix: 'Непотрібна зміна.' });
  assert.equal(evaluateSubmission(answer).checks[0].earned, 0);
});

test('локаторні проблеми, пропущений assertion і run evidence розрізняються', () => {
  const golden = loadGolden().cases;
  assert.deepEqual(golden[1].findings.map(item => item.id), ['LOCATOR_XPATH']);
  assert.deepEqual(golden[3].findings.map(item => item.id), ['LOCATOR_POSITIONAL']);
  assert.deepEqual(golden[4].findings.map(item => item.id), ['MISSING_ASSERTION', 'FIXED_WAIT']);
  assert.deepEqual(golden[5].findings.map(item => item.id), ['RUN_FAILED', 'RUN_RETRIES']);
  const run = JSON.parse(readFileSync(path.join(root, golden[5].fixture, 'context.json'), 'utf8')).run;
  assert.equal(run.exitCode, 1);
  assert.equal(run.command.includes('--retries=0'), false);
});

test('невідомий сценарій і некоректний формат відхиляються', () => {
  assert.throws(() => evaluateSubmission({ scenarioId: 'REV-02' }), /verdict/);
  assert.throws(() => evaluateSubmission({ scenarioId: 'UNKNOWN', verdict: 'VALID', findings: [] }), /Невідомий сценарій/);
});
