import { expect, test } from '@playwright/test';
import { HomePage } from '../pages/home.page';

test('TC-MP-001 — Логотип Hillel auto відображається як посилання', async ({ page }) => {
  const home = new HomePage(page);

  await home.open();

  await expect(home.logoLink).toBeVisible();
  await expect(home.logoLink).toHaveAttribute('href', /.+/);
  await expect(home.logoSvg).toBeVisible();
});
