# Run evidence

- Tool: Codex extension for VS Code, ChatGPT sign-in
- Case: `<назва сторінки; повний case ID; Notion URL>`
- Test: `<tests/файл.spec.ts :: точна назва test() з case ID>`
- Run: `<1/2 або 2/2; кожен виклик Playwright Test, навіть невдалий, враховано>`
- Command: `<точна команда з --retries=0>`
- Exit code: `<фактичний код виходу>`
- Timestamp: `<ISO 8601>`
- Environment: `<ОС>, Playwright Chromium, URL без credentials`
- Actual: `<дослівний підсумок або error>`

| Елемент | Джерело |
|---|---|
| setup | |
| locator/action | |
| assertions | |

- FACTS:
- ASSUMPTIONS:
- RISKS:
- HUMAN CORRECTION:
- REVIEWER VERDICT: `VALID` / `CHANGES REQUESTED` / `BLOCKED` / `BLOCKED_AFTER_2_RUNS` —
- Якщо після 2/2 немає `VALID`: `<повідомлення користувачу з обома командами, exit codes, підсумками й невирішеною причиною>`
- Notion Автоматизовано: `<фактичне значення після перевірки читанням; URL; час або NOTION_SYNC_BLOCKED>`
