import { readFileSync, realpathSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const verdicts = new Set(['VALID', 'CHANGES REQUESTED', 'BLOCKED', 'BLOCKED_AFTER_2_RUNS']);

export function loadGolden() {
  return JSON.parse(readFileSync(path.join(root, 'evaluation/golden.json'), 'utf8'));
}

export function validateSubmission(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error('Відповідь має бути JSON-об’єктом.');
  }
  if (typeof value.scenarioId !== 'string' || !value.scenarioId) {
    throw new Error('scenarioId має бути непорожнім рядком.');
  }
  if (!verdicts.has(value.verdict)) {
    throw new Error('verdict має бути VALID, CHANGES REQUESTED, BLOCKED або BLOCKED_AFTER_2_RUNS.');
  }
  if (!Array.isArray(value.findings) || !value.findings.every(finding =>
    finding && typeof finding === 'object' &&
    ['id', 'file', 'problem', 'impact', 'fix'].every(key => typeof finding[key] === 'string') &&
    Number.isInteger(finding.line) && finding.line > 0)) {
    throw new Error('findings має бути масивом {id, file, line, problem, impact, fix}.');
  }
  return value;
}

function expectedLocation(golden, finding) {
  const fixture = path.resolve(root, golden.fixture);
  const absolute = realpathSync(path.resolve(fixture, finding.file));
  if (!absolute.startsWith(fixture + path.sep)) throw new Error(`Некоректний шлях у golden set: ${finding.file}`);
  const lines = readFileSync(absolute, 'utf8').split(/\r?\n/);
  const matches = lines.flatMap((line, index) => line.trim() === finding.anchor.trim() ? [index + 1] : []);
  if (matches.length !== 1) throw new Error(`Golden anchor має мати один збіг: ${golden.id}/${finding.id}`);
  return matches[0];
}

function criterion(id, points, earned, detail) {
  return { id, points, earned: Math.round(earned * 10) / 10, detail };
}

export function evaluateSubmission(raw, goldenSet = loadGolden()) {
  const submission = validateSubmission(raw);
  const golden = goldenSet.cases.find(item => item.id === submission.scenarioId);
  if (!golden) throw new Error(`Невідомий сценарій: ${submission.scenarioId}`);

  const expected = golden.findings.map(finding => ({ ...finding, line: expectedLocation(golden, finding) }));
  const used = new Set();
  const matched = expected.map(finding => {
    const index = submission.findings.findIndex((item, i) => !used.has(i) && item.id === finding.id);
    if (index < 0) return { expected: finding, actual: null };
    used.add(index);
    return { expected: finding, actual: submission.findings[index] };
  });
  const extra = submission.findings.filter((_, index) => !used.has(index));
  const found = matched.filter(item => item.actual);
  const located = found.filter(({ expected: ref, actual }) => actual.file === ref.file && actual.line === ref.line);
  const actionable = found.filter(({ actual }) =>
    ['problem', 'impact', 'fix'].every(key => actual[key].trim().length >= 12));

  let checks;
  if (expected.length === 0) {
    checks = [
      criterion('no_false_positives', 50, extra.length === 0 ? 50 : 0,
        extra.length ? `Зайві зауваження: ${extra.map(item => item.id).join(', ')}.` : 'Зауважень немає.'),
      criterion('verdict', 50, submission.verdict === golden.verdict ? 50 : 0,
        `Очікуваний вердикт: ${golden.verdict}; отримано: ${submission.verdict}.`)
    ];
  } else {
    checks = [
      criterion('defect_recall', 45, 45 * found.length / expected.length,
        `Знайдено ${found.length}/${expected.length}; пропущено: ${matched.filter(item => !item.actual).map(item => item.expected.id).join(', ') || 'немає'}.`),
      criterion('location', 20, 20 * located.length / expected.length,
        `Точні файл і рядок: ${located.length}/${expected.length}.`),
      criterion('actionable_feedback', 15, 15 * actionable.length / expected.length,
        `Проблема, наслідок і виправлення заповнені: ${actionable.length}/${expected.length}. Зміст перевіряється людиною.`),
      criterion('precision', 10, submission.findings.length ? 10 * found.length / submission.findings.length : 0,
        `Зайві або дубльовані зауваження: ${extra.map(item => item.id).join(', ') || 'немає'}.`),
      criterion('verdict', 10, submission.verdict === golden.verdict ? 10 : 0,
        `Очікуваний вердикт: ${golden.verdict}; отримано: ${submission.verdict}.`)
    ];
  }
  return {
    scenarioId: golden.id,
    title: golden.title,
    score: Math.round(checks.reduce((total, item) => total + item.earned, 0) * 10) / 10,
    checks,
    missed: matched.filter(item => !item.actual).map(item => ({ id: item.expected.id, file: item.expected.file, line: item.expected.line })),
    extra: extra.map(item => item.id),
    wrongLocations: found.filter(({ expected: ref, actual }) => actual.file !== ref.file || actual.line !== ref.line)
      .map(({ expected: ref, actual }) => ({ id: ref.id, expected: `${ref.file}:${ref.line}`, actual: `${actual.file}:${actual.line}` })),
    humanReview: 'Чи правильно Reviewer пояснив правило, наслідок і виправлення? Бал перевіряє наявність цих полів, а не зміст.'
  };
}
