import { expect, test } from '@playwright/test';
import { HomePage } from '../pages/home.page';

test('DEMO-MP-005 — Гостьовий вхід', async ({ page }) => {
  const home = new HomePage(page);
  await home.open();
  await home.loginAsGuest();
  await page.waitForTimeout(1000);
  await expect(page).toHaveURL('/panel/garage');
});
