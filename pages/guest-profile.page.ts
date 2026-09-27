import type { Locator, Page } from '@playwright/test';

export class GuestProfilePage {
  readonly availableTabs: Locator;

  constructor(page: Page) {
    this.availableTabs = page
      .getByRole('banner')
      .getByRole('navigation')
      .getByRole('link');
  }
}
