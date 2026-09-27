import type { Locator, Page } from '@playwright/test';

export class HomePage {
  readonly guestLogInButton: Locator;
  readonly logoLink: Locator;
  readonly logoSvg: Locator;

  constructor(private readonly page: Page) {
    this.guestLogInButton = page.getByRole('button', { name: 'Guest log in' });
    this.logoLink = page.getByRole('banner').locator('a.header_logo');
    this.logoSvg = this.logoLink.locator('svg');
  }

  async open(): Promise<void> {
    await this.page.goto('/');
  }

  async loginAsGuest(): Promise<void> {
    await this.guestLogInButton.click();
  }
}
