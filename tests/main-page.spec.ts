import { expect, test } from '@playwright/test';
import { GuestProfilePage } from '../pages/guest-profile.page';
import { HomePage } from '../pages/home.page';

test('TC-MP-001 — Логотип Hillel auto відображається як посилання', async ({ page }) => {
  const home = new HomePage(page);

  await home.open();

  await expect(home.logoLink).toBeVisible();
  await expect(home.logoLink).toHaveAttribute('href', /.+/);
  await expect(home.logoSvg).toBeVisible();
});

test('TC-MP-002 — Кнопка Home відображається як посилання', async ({ page }) => {
  const home = new HomePage(page);

  await home.open();

  await expect(home.homeLink).toBeVisible();
  await expect(home.homeLink).toHaveAttribute('href', /.+/);
});

test('TC-MP-003 — Перехід до секції About', async ({ page }) => {
  const home = new HomePage(page);

  await home.open();
  await expect(home.aboutSection).not.toBeInViewport({ ratio: 1 });

  await home.navigateToAbout();

  await expect(home.aboutSection).toBeInViewport({ ratio: 1 });
});

test('TC-MP-004 — Перехід до секції Contacts', async ({ page }) => {
  const home = new HomePage(page);

  await home.open();
  await expect(home.contactsSection).not.toBeInViewport({ ratio: 1 });

  await home.navigateToContacts();

  await expect(home.contactsSection).toBeInViewport({ ratio: 1 });
});

test('TC-MP-005 — Перехід до гостьових профілів', async ({ page }) => {
  const home = new HomePage(page);
  const guestProfile = new GuestProfilePage(page);

  await home.open();

  await home.loginAsGuest();

  await expect(page).toHaveURL('/panel/garage');
  await expect(guestProfile.guestSessionNotice).toBeVisible();
});
