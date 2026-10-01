import type { Locator, Page } from '@playwright/test';

export class HomePage {
  readonly guestButton: Locator;

  constructor(private readonly page: Page) {
    this.guestButton = page.getByRole('button', { name: 'Guest log in' }).first();
  }

  async open(): Promise<void> { await this.page.goto('/'); }
  async loginAsGuest(): Promise<void> { await this.guestButton.click(); }
}
