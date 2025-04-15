// tests/auth.spec.js
const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');
const { InventoryPage } = require('../pages/InventoryPage');

// Test data for different user types
const users = {
  standard: {
    username: 'standard_user',
    password: 'secret_sauce',
    description: 'Standard user with full access'
  },
  locked: {
    username: 'locked_out_user',
    password: 'secret_sauce',
    description: 'Locked out user'
  },
  problem: {
    username: 'problem_user',
    password: 'secret_sauce',
    description: 'User with item display issues'
  },
  performance: {
    username: 'performance_glitch_user',
    password: 'secret_sauce',
    description: 'User with performance issues'
  }
};

test.describe('SauceDemo Authentication Tests', () => {
  let loginPage;
  let inventoryPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    await loginPage.navigate();
  });

  // Positive test cases
  test('Standard user can login successfully', async () => {
    await loginPage.login(users.standard.username, users.standard.password);
    await expect(inventoryPage.pageTitle).toBeVisible();
  });

  test('Problem user can login successfully', async () => {
    await loginPage.login(users.problem.username, users.problem.password);
    await expect(inventoryPage.pageTitle).toBeVisible();
  });

  test('Performance glitch user can login successfully', async () => {
    await loginPage.login(users.performance.username, users.performance.password);
    await expect(inventoryPage.pageTitle).toBeVisible();
  });

  // Negative test cases
  test('Locked out user cannot login', async () => {
    await loginPage.login(users.locked.username, users.locked.password);
    await expect(loginPage.errorMessage).toContainText('Sorry, this user has been locked out');
  });

  test('Invalid credentials show error message', async () => {
    await loginPage.login('invalid_user', 'wrong_password');
    await expect(loginPage.errorMessage).toContainText('Username and password do not match');
  });

  test('Empty credentials show error message', async () => {
    await loginPage.login('', '');
    await expect(loginPage.errorMessage).toContainText('Username is required');
  });

  // Security tests
  test('Password field should be masked', async () => {
    await loginPage.enterPassword('secret_sauce');
    const inputType = await loginPage.passwordField.getAttribute('type');
    expect(inputType).toBe('password');
  });

  test('Session should expire after logout', async () => {
    await loginPage.login(users.standard.username, users.standard.password);
    await inventoryPage.logout();
    await expect(loginPage.usernameField).toBeVisible();
  });
});