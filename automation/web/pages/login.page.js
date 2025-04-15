const { expect } = require('@playwright/test');

class LoginPage {
  constructor(page) {
    this.page = page;
    this.usernameField = page.locator('[data-test="username"]');
    this.passwordField = page.locator('[data-test="password"]'); 
    this.loginButton = page.locator('[data-test="login-button"]');
    this.errorMessage = page.locator('[data-test="error"]');
    this.secondaryHeader = page.locator('[data-test="secondary-header"]');
    this.primaryHeader = page.locator('[data-test="primary-header"]');
    this.inventoryList = page.locator('[data-test="inventory-list"]');

  }

  async login(username, password) {
    await this.usernameField.fill(username);
    await this.passwordField.fill(password);
    await this.loginButton.click();

    await Promise.race([
      this.page.waitForURL(/inventory/),
      this.errorMessage.waitFor()
    ]);
  }

  async verifySuccessfulLogin() {
    await expect(this.primaryHeader).toContainText('Swag Labs');
    await expect(this.secondaryHeader).toHaveText(
      'ProductsName (A to Z)Name (A to Z)Name (Z to A)Price (low to high)Price (high to low)'
    );
  }

  async verifySuccessWithIssuesInventory() {
    await expect(
      this.page.locator('[data-test="inventory-list"] div')
        .filter({ hasText: 'Sauce Labs Backpackcarry.' })
        .nth(1)
    ).toBeVisible();

    // Validate detailed product text
    await expect(
      this.page.locator('[data-test="inventory-list"]')
    ).toContainText(
      'Sauce Labs Backpackcarry.allTheThings() with the sleek, streamlined Sly Pack that melds uncompromising style with unequaled laptop and tablet protection.$29.99Add to cart'
    );
  }

  async verifyUiIssuesInventory() {
    await expect(
      this.inventoryList
    ).toMatchAriaSnapshot(`
      - link "Test.allTheThings() T-Shirt (Red)"
      - text: /This classic Sauce Labs t-shirt is perfect to wear when cozying up to your keyboard to automate a few tests\\. Super-soft and comfy ringspun combed cotton\\. \\$\\d+\\.\\d+/
      - button "Add to cart"
    `);
  }
}

module.exports = { LoginPage };
