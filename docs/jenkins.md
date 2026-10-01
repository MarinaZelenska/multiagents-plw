# Локальний Jenkins для Playwright на macOS

Цей `Jenkinsfile` налаштовано для Jenkins, запущеного на цьому Mac через
Homebrew. Він читає локальну папку проєкту, тому не потребує Git checkout або
публікації змін. Він не змінює тест-кейси чи Notion.

## Перший запуск Jenkins

1. У Terminal виконайте `brew install jenkins-lts`, потім
   `brew services start jenkins-lts`.
2. Відкрийте `http://localhost:8080`, завершіть початкове налаштування та
   виберіть **Install suggested plugins**.
3. У Jenkins виберіть **Create a job**, назвіть його `qauto-playwright`,
   виберіть **Pipeline** і натисніть **OK**.
4. На сторінці конфігурації в секції **Pipeline** залиште
   **Definition: Pipeline script**. Скопіюйте повний вміст кореневого
   `Jenkinsfile` у поле **Script** і натисніть **Save**.
5. Натисніть **Build Now**. Відкрийте номер збірки й **Console Output**.

На цьому Mac фонова служба Jenkins не отримала доступ до проєкту в
`Downloads`: перша збірка зупинилася на `npm ci` з `EPERM: uv_cwd`, ще до
запуску Playwright Test. Для локальної роботи з цією папкою зупиніть службу
командою `brew services stop jenkins-lts` і запустіть Jenkins у Terminal:

```bash
jenkins-lts --httpListenAddress=127.0.0.1 --httpPort=8080
```

Залишайте це вікно Terminal відкритим, доки працюєте з Jenkins. Якщо macOS
запитає дозвіл на доступ до `Downloads`, надайте його. Після появи повідомлення
про готовність відкрийте `http://localhost:8080` і повторіть збірку.

Pipeline запускається на вбудованому вузлі Jenkins, використовує проєкт у
`/Users/user/Downloads/qauto-playwright-starter/playwright-starter` та Node.js
із `/Users/user/.nvm/versions/node/v22.14.0/bin`. Якщо проєкт або Node.js
переміститься, оновіть ці шляхи в `Jenkinsfile` і в полі **Script** job.

Перед запуском перевірте наявність локального `.playwright/cli.config.json`.
Playwright Test читає звідти HTTP credentials; файл ігнорується Git і його
вміст не потрібно копіювати в Jenkins чи чат. Pipeline робить `npm ci`,
встановлює Chromium, перевіряє TypeScript і виконує тести з `--retries=0`.
Стандартний HTML report Playwright і файли тестового запуску будуть у
**Artifacts**. На цьому Mac HTML report можна відкрити з папки проєкту
командою `npm run report`. Ці artifacts можуть містити дані тестової сесії.

## Відкрити звіт за посиланням Jenkins

Архівний `playwright-report/index.html` відкривався порожньою сторінкою,
оскільки стандартна політика Jenkins забороняє JavaScript у файлах збірки.
Для локального Jenkins залиште основний URL `http://localhost:8080/`, а в
**Manage Jenkins → System → Serve resource files from another domain** задайте
**Resource Root URL** `http://127.0.0.1:8080/` і збережіть. Це інше ім'я хоста
для того самого локального Jenkins; він запущений лише на `127.0.0.1`.

Після цього відкрийте **qauto-playwright → #3 → Artifacts →
playwright-report → index.html**. Jenkins перенаправить файл на окрему адресу,
де інтерактивний звіт може виконувати свій JavaScript. Перезапускати тести для
цього налаштування не потрібно.

`npm run preflight` потрібен для етапу Analyzer, який створює нові тести через
Playwright CLI. Pipeline запускає вже готові тести й не викликає preflight.
Для автоматизації нового кейса дотримуйтесь `AGENTS.md`.
