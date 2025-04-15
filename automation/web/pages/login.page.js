const { expect } = require('@playwright/test');

class LoginPage {
  constructor(page) {
    this.page = page;
    this.usernameField = page.locator('[data-test="username"]');
    this.passwordField = page.locator('[data-test="password"]'); // ✅ corrected
    this.loginButton = page.locator('[data-test="login-button"]');
    this.errorMessage = page.locator('[data-test="error"]');
    this.secondaryHeader = page.locator('[data-test="secondary-header"]');
    this.primaryHeader = page.locator('[data-test="primary-header"]');
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
}

module.exports = { LoginPage };
