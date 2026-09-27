---
name: qauto-cli-locators
description: Допомогти Analyzer перевірити локатори QAuto в поточному UI через локальний Playwright CLI перед створенням diff.
---

# QAuto CLI locators

Прочитай `AGENTS.md`, `docs/test-standards.md` і контракт знайденого Notion-кейса з handoff. Починай CLI лише після успішного пошуку кейса за назвою сторінки й номером. Перед відкриттям UI перевір `npx --no-install playwright cli --version` та `npm run preflight`. Якщо CLI або Chromium чи локальний config не готові, поверни `CLI SETUP BLOCKER` і кроки підготовки з README.

У межах завдання Analyzer використовуй перший запуск `npx playwright cli open https://qauto.forstudy.space --config=.playwright/cli.config.json` (дозволено додати ім'я сесії `-s=...`). Далі отримай `snapshot`, виконай потрібні дії за refs, `generate-locator <ref>` для елементів тесту та перевір однозначність у відповідному стані. Закрий сесію.

Поверни тільки безпечне evidence: стан сторінки, дата, короткий фрагмент snapshot/ref, вираз locator, результат перевірки. Не показуй вміст `.env`, `.playwright/cli.config.json`, cookies, tokens, credentials або непотрібні заголовки network requests. Не використовуй Browser connector для цієї практики.
