import { expect, test } from '@playwright/test';
import { HomePage } from '../pages/home.page';

test('DEMO-MP-002 — Гостьовий вхід', async ({ page }) => {
  const home = new HomePage(page);
  await home.open();
  await home.loginAsGuest();
  await expect(page).toHaveURL('/panel/garage');
  await expect(home.notice).toBeVisible();
});
