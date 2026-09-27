import { expect, test } from '@playwright/test';
import { GuestProfilePage } from '../pages/guest-profile.page';
import { HomePage } from '../pages/home.page';

test('TC-GP-003 — Доступні вкладки гостьового профілю', async ({ page }) => {
  const home = new HomePage(page);
  const guestProfile = new GuestProfilePage(page);

  await home.open();
  await home.loginAsGuest();

  await expect(guestProfile.availableTabs).toHaveText([
    'Garage',
    'Fuel expenses',
    'Instructions'
  ]);
});
