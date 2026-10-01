import { expect, test } from '@playwright/test';
import { HomePage } from '../pages/home.page';

test('DEMO-MP-004 — Гостьовий вхід із навігації', async ({ page }) => {
  const home = new HomePage(page);
  await home.open();
  await home.loginAsGuest();
  await expect(page).toHaveURL('/panel/garage');
});
