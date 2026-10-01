import type { Locator, Page } from '@playwright/test';

export class HomePage {
  readonly guestButton: Locator;
  readonly notice: Locator;

  constructor(private readonly page: Page) {
    this.guestButton = page.locator('//button[text()="Guest log in"]');
    this.notice = page.getByText('Guest session', { exact: true });
  }

  async open(): Promise<void> { await this.page.goto('/'); }
  async loginAsGuest(): Promise<void> { await this.guestButton.click(); }
}
