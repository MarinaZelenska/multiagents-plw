import { expect, test } from '@playwright/test';
import { GuestProfilePage } from '../pages/guest-profile.page';
import { HomePage } from '../pages/home.page';

test('TC-GP-001 — Збереження даних у поточній сесії', async ({ page }) => {
  const home = new HomePage(page);
  const guestProfile = new GuestProfilePage(page);
  const car = { brand: 'Audi', model: 'TT', mileage: '12345' };
  const carName = `${car.brand} ${car.model}`;

  await home.open();
  await home.loginAsGuest();
  await expect(guestProfile.guestSessionNotice).toBeVisible();

  await guestProfile.addCar(car.brand, car.model, car.mileage);
  await expect(guestProfile.carMileage(carName)).toHaveValue(car.mileage);

  await guestProfile.navigateToFuelExpenses();
  await expect(guestProfile.fuelExpensesHeading).toBeVisible();
  await guestProfile.navigateToGarage();

  await expect(guestProfile.carEntry(carName)).toBeVisible();
  await expect(guestProfile.carMileage(carName)).toHaveValue(car.mileage);
});

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
