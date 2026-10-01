import type { Locator, Page } from '@playwright/test';

export class HomePage {
  readonly guestLogInButton: Locator;
  readonly logoLink: Locator;
  readonly logoSvg: Locator;
  readonly homeLink: Locator;
  readonly aboutButton: Locator;
  readonly aboutSection: Locator;
  readonly contactsButton: Locator;
  readonly contactsSection: Locator;

  constructor(private readonly page: Page) {
    this.guestLogInButton = page.getByRole('button', { name: 'Guest log in', exact: true });
    this.logoLink = page.getByRole('banner').locator('a.header_logo');
    this.logoSvg = this.logoLink.locator('svg');
    this.homeLink = page.getByRole('banner').getByRole('link', { name: 'Home', exact: true });
    this.aboutButton = page.getByRole('banner').getByRole('button', { name: 'About', exact: true });
    this.aboutSection = page.locator('#aboutSection');
    this.contactsButton = page.getByRole('banner').getByRole('button', { name: 'Contacts', exact: true });
    this.contactsSection = page.locator('#contactsSection');
  }

  async open(): Promise<void> {
    await this.page.goto('/');
  }

  async navigateToAbout(): Promise<void> {
    await this.aboutButton.click();
  }

  async navigateToContacts(): Promise<void> {
    await this.contactsButton.click();
  }

  async loginAsGuest(): Promise<void> {
    await this.guestLogInButton.click();
  }
}
