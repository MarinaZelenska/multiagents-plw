# Документація агентського процесу QAuto

`docs/` містить правила роботи агентів і матеріали для занять. Практикум із перевірки Reviewer зберігається в сусідній папці [`evaluation/`](../evaluation/README.md): там є синтетичні кейси, правила оцінювання та локальний CLI. Ці вправи не є тест-кейсами Notion і не входять до запуску Playwright Test.

## Робота агентів

- [Джерела кейсів у Notion](notion-test-cases.md)
- [Стандарти тестів](test-standards.md)
- [Page Object і локатори](page-object-locators.md)

Межі дій та погодження визначає [`AGENTS.md`](../AGENTS.md), ролі — `.codex/agents/`, а допоміжні скіли — `.agents/skills/` у корені проєкту.

## Навчальні матеріали

- [Практикум із сабагентами](subagents-workshop.md)
- [Інтерактивні схеми та лекція](learning-diagrams/README.md)
- [Заняття з оцінювання Reviewer](evaluation-workshop.md) і [сценарії оцінювача](../evaluation/README.md)
- [Запуск на Jenkins](jenkins.md)
