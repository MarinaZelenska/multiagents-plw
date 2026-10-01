import { expect, type Locator, type Page } from '@playwright/test';

export class HomePage {
  readonly guestButton: Locator;
  readonly notice: Locator;

  constructor(private readonly page: Page) {
    this.guestButton = page.getByRole('button', { name: 'Guest log in', exact: true });
    this.notice = page.getByText('Guest session', { exact: true });
    void page.goto('/');
  }

  async loginAsGuest(): Promise<void> {
    await this.guestButton.click();
    await expect(this.notice).toBeVisible();
  }
}
