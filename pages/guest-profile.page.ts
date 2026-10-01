import type { Locator, Page } from '@playwright/test';

export class GuestProfilePage {
  readonly availableTabs: Locator;
  readonly guestSessionNotice: Locator;

  readonly addCarButton: Locator;
  readonly addCarDialog: Locator;
  readonly brandSelect: Locator;
  readonly modelSelect: Locator;
  readonly mileageInput: Locator;
  readonly addButton: Locator;
  readonly fuelExpensesLink: Locator;
  readonly fuelExpensesHeading: Locator;
  readonly garageLink: Locator;

  constructor(private readonly page: Page) {
    this.guestSessionNotice = page
      .getByRole('banner')
      .getByText('Logged in as guest, any changes will be lost!', { exact: true });
    this.availableTabs = page
      .getByRole('banner')
      .getByRole('navigation')
      .getByRole('link');
    this.addCarButton = page.getByRole('button', { name: 'Add car', exact: true });
    this.addCarDialog = page.getByRole('dialog');
    this.brandSelect = this.addCarDialog.getByLabel('Brand', { exact: true });
    this.modelSelect = this.addCarDialog.getByLabel('Model', { exact: true });
    this.mileageInput = this.addCarDialog.getByLabel('Mileage', { exact: true });
    this.addButton = this.addCarDialog.getByRole('button', { name: 'Add', exact: true });
    this.fuelExpensesLink = page.getByRole('banner').getByRole('link', { name: 'Fuel expenses', exact: true });
    this.fuelExpensesHeading = page.getByRole('heading', { name: 'Fuel expenses', exact: true });
    this.garageLink = page.getByRole('banner').getByRole('link', { name: 'Garage', exact: true });
  }

  async addCar(brand: string, model: string, mileage: string): Promise<void> {
    await this.addCarButton.click();
    await this.brandSelect.selectOption({ label: brand });
    await this.modelSelect.selectOption({ label: model });
    await this.mileageInput.fill(mileage);
    await this.addButton.click();
  }

  async navigateToFuelExpenses(): Promise<void> {
    await this.fuelExpensesLink.click();
  }

  async navigateToGarage(): Promise<void> {
    await this.garageLink.click();
  }

  carEntry(name: string): Locator {
    return this.page.getByRole('listitem').filter({
      has: this.page.getByText(name, { exact: true })
    });
  }

  carMileage(name: string): Locator {
    return this.carEntry(name).getByRole('spinbutton');
  }
}
