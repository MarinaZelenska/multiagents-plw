# Готовий навчальний проєкт Playwright

Це заздалегідь підготовлена папка проєкту, а не завдання на побудову фреймворку з нуля. У ній уже є залежності, налаштування Playwright і TypeScript, тест за поточним процесом та правила для Codex. `tsconfig.json` підключає Node-типи й перевірку Playwright-файлів у VS Code. `tests/guest-profile.spec.ts` є прикладом реалізації кейса `TC-GP-003`; джерело вимог для нових тестів — точний кейс у Notion. `AGENTS.md` визначає межі для Codex, а `templates/run-evidence.md` — форму підтвердження. План розвитку архітектури збережено у `generated/implementation-plan.md`.

## Демонстрація сабагентів

Структура тестового коду: коренева `pages/` містить Page Object (`*.page.ts`), коренева `tests/` — сценарії (`*.spec.ts`). Тести імпортують моделі з `../pages/`; TypeScript перевіряє обидві папки.

Для окремого заняття використайте `docs/subagents-workshop.md`. Вхід: **назва сторінки та номер кейса**, наприклад `Хочу покрити кейс TC-MP-005 по сторінці mainPage`. Три проєктні ролі містяться в `.codex/agents/`: Analyzer знаходить кейс через плагін Notion у `QAuto — База знань`, перевіряє локатори через CLI й зберігає diff; Implementer застосовує погоджений diff і запускає тест; Reviewer перевіряє покриття кейса, код та output. Шість скілів у `.agents/skills/` підтримують процес. Правила джерел і синхронізації — `docs/notion-test-cases.md`, стандарти тестів — `docs/test-standards.md`, передавання — `templates/agent-handoff.md`.

Для пояснення студентам є [симулятор процесу](docs/learning-diagrams/qauto-workflow.html) і [схема контекстних вікон агентів](docs/learning-diagrams/agent-context.html). Обидва файли відкриваються безпосередньо у браузері.

Якщо кейс на вказаній сторінці не знайдений, Analyzer повертає `CASE_NOT_FOUND` і зупиняється до CLI та diff. Для уточнення він читає вимоги лише цієї сторінки; сутності й API — за потреби для кейса. Доступ до Notion тільки через плагін, без окремого MCP або прямого API. Координатор оновлює колонку `Автоматизовано` за результатом роботи: `☐` зі статусом до успіху та `☑` із файлом і точною назвою тесту після `VALID`. У поточних звичайних таблицях це текстові позначки в одній комірці.

Єдина планова точка погодження — `APPROVE DIFF vN`. Analyzer зберігає diff у `generated/diffs/` і показує його для перевірки. Після погодження Implementer реалізує зміни й запускає тест; Reviewer одразу перевіряє результат. За `CHANGES REQUESTED` Implementer виправляє зауваження в тих самих межах, зберігає новий diff і повторює перевірки без нового погодження. Максимум — два запуски Playwright Test на завдання, кожен із `--retries=0`. Якщо після другого немає `VALID`, координатор повідомляє користувачу `BLOCKED_AFTER_2_RUNS` з обома результатами й причиною.

## Підготовка викладача

1. Встановіть Node.js LTS, VS Code і Codex extension для VS Code.
2. Виконайте `npm ci`, `npx playwright install chromium` і `npm run preflight`.
   Готовий LMS-архів уже містить `.playwright/cli.config.json`.
3. Відкрийте Codex Sidebar у VS Code й увійдіть через ChatGPT; не використовуйте API key для обов'язкової безкоштовної практики.
4. Не змінюйте browser-auth config: його вже використовують Playwright CLI і
   Playwright Test.

HTTP Basic Authentication — це системне вікно входу перед інтерфейсом QAuto.
Playwright не заповнює його кліками: `playwright.config.ts` читає
`httpCredentials` із локального `.playwright/cli.config.json`. Каталог
`.playwright/` уже додано до `.gitignore`; готовий config постачається лише у
LMS-архіві й не комітиться у Git.

## Маршрут студента

Людина спочатку встановлює Node.js LTS, VS Code і Codex extension, входить у
Codex через ChatGPT та відкриває саме папку готового навчального проєкту. Codex можна доручити
перевірку середовища й наведені нижче команди, але тільки після явного дозволу
на інсталяцію залежностей. Встановити й авторизувати самого себе Codex не може.

Розширення Playwright Test for VS Code є зручним, але необов'язковим. Окреме
розширення TypeScript не потрібне: VS Code уже підтримує TypeScript.

```bash
npm ci
npx playwright install chromium
npm run preflight
```

Не запускайте `npm init playwright@latest`: це створить інший проєкт і може
перезаписати навчальну структуру. Готовий проєкт уже містить config,
приклад тесту за поточним процесом та правила для агента.

Для практики передайте назву сторінки та номер наявного кейса з Notion.
Analyzer знаходить саме цей кейс, досліджує UI через CLI й зберігає точний `PATCH vN`
у `generated/diffs/`. Після `APPROVE DIFF vN`
Implementer створює погоджені файли та запускає окремий тест із `--retries=0`.
Reviewer повертає `VALID` або `CHANGES REQUESTED`; у другому випадку Implementer
виправляє зауваження в погоджених межах і запускає тест удруге, теж із
`--retries=0`. Якщо після цього `VALID` немає, автоматичний цикл завершується
повідомленням `BLOCKED_AFTER_2_RUNS`.

Після вердикту координатор синхронізує `Автоматизовано` через плагін Notion
і перевіряє запис. Помилка синхронізації — окремий `NOTION_SYNC_BLOCKED`.

Codex доступний через ChatGPT Free з обмеженою квотою, яка може змінюватися. Якщо квота або вхід недоступні, код можна відтворити вручну за тим самим контрактом; результат запуску не вигадується.

## Playwright Test, CLI і MCP

- `npx playwright test` — канонічний runner: виконує test suite і створює report/trace.
- Playwright CLI для coding agents — основний агентний інтерфейс для швидкого дослідження сторінки через команди та snapshots. У готовому проєкті він запускається локально як `npx playwright cli`; глобальна інсталяція не потрібна. Проєктні скіли в `.agents/skills/` описують навчальний процес, але CLI залишається локальним інструментом.
- Playwright MCP — додатковий server для клієнтів, яким потрібна тривала браузерна сесія та багате структуроване спостереження. Для обов'язкової практики він не потрібний.

CLI або MCP допомагає агенту спостерігати UI, але фінальний артефакт лишається звичайним Playwright Test у Git і фактичний output runner-а.

Обов'язкова практика не підключається до вже відкритого браузера і не залежить
від списку `connected browsers`. Локальний `.playwright/cli.config.json`
містить HTTP credentials і не додається в Git. Агент передає шлях через
`--config`, не копіюючи значення доступу у відповідь або test evidence.
Під час етапу Analyzer Codex:

1. запускає `npx playwright cli -s=lecture07 open ... --config=.playwright/cli.config.json`;
2. виконує `npx playwright cli -s=lecture07 snapshot`;
3. переходить до `Instructions` за refs зі snapshot і виконує
   `npx playwright cli -s=lecture07 generate-locator <ref>` для потрібних елементів;
4. виконує `npx playwright cli -s=lecture07 close` і фіксує evidence;
5. зберігає точний diff, а Implementer створює test лише після `APPROVE DIFF vN`.

Якщо `npx --no-install playwright cli --version` недоступна або preflight показує
`Playwright CLI Chromium ready: false` чи `Playwright CLI config ready: false`,
це `CLI SETUP BLOCKER`. Виконайте `npm ci`, установіть Chromium, підготуйте
локальний config і повторіть preflight; не шукайте Browser
connector.
