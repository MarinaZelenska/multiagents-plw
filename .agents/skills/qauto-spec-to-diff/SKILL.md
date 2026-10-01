---
name: qauto-spec-to-diff
description: Перетворити знайдений у Notion QAuto тест-кейс на точний diff із Page Object після перевірки UI через Playwright CLI.
---

# QAuto spec to diff

Для Page Object і локаторів обов’язково прочитай [спільну інструкцію для агентів](../../../docs/page-object-locators.md) перед відповідним етапом роботи.

Прочитай `AGENTS.md`, `docs/test-standards.md` і `templates/agent-handoff.md`. Спочатку використай `qauto-notion-cases`: за назвою сторінки та номером отримай повний кейс через плагін Notion. Якщо кейса немає — `CASE_NOT_FOUND` і зупинка без CLI/diff. Уточнюй лише вимоги цієї сторінки; сутності й API — адресно за потреби. Не підміняй відсутній кейс іншим джерелом.

Склади контракт із case ID, URL/ID Notion-сторінки, часом читання, передумовами, кроками, даними, джерелами кожного expected result і точним переліком файлів. Назва test() має містити повний case ID. Не добудовуй вимоги з UI. Сам використай `qauto-cli-locators` для перевірки поточного UI перед написанням diff.

На підставі власного CLI evidence збережи повний unified diff `PATCH vN` лише для названих файлів у новому `generated/diffs/<назва-завдання>-vN.diff`. Не перезаписуй попередні версії. Покажи шлях, SHA-256 і вміст для єдиного погодження. Для Page Object дотримуйся `docs/page-object-locators.md`; тримай `expect` у тесті. Додай мапу assertion → case/REQ-ID і locator → CLI evidence, точну команду запуску з `--retries=0` та `tests/<файл>.spec.ts :: <назва тесту>` для Notion.

Не застосовуй patch до тестових файлів. Якщо evidence бракує або UI суперечить кейсу, повідом `QUESTION` чи `STOP`, не підставляй здогад.
