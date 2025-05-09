// tests/login.spec.js
const { test, expect } = require('@playwright/test');
const users = require('../../test-data/userDataProvider.js');
const { WebBaseTest } = require('../web_utilities/webBaseTest');
const { LoginPage } = require('../pages/login.page.js')
const { InventoryPage } = require('../pages/inventoryPage');

test.describe('SauceDemo Login Tests - Comprehensive User Validation', () => {
    let loginPage, inventoryPage;

    test.beforeAll(async () => {
        await WebBaseTest.setupClass();
    });

    test.beforeEach(async () => {
        await WebBaseTest.setUp();
        loginPage = new LoginPage(WebBaseTest.page);
        inventoryPage = new InventoryPage(WebBaseTest.page);
    });

    test.afterEach(async () => {
        await WebBaseTest.captureScreenshot(
            'LoginTests',
            `${test.info().title.replace(/\s+/g, '-').toLowerCase()}-${test.info().status}`
        );
        await WebBaseTest.tearDown();
    });

    test.afterAll(async () => {
        await WebBaseTest.tearDownClass();
    });

    users.forEach(user => {
        test(`Validate ${user.username} (${user.expectedResult})`, async () => {

            // Execute login with the robust LoginPage method
            await loginPage.login(user.username, user.password);

            // Special handling for each user type
            switch (user.expectedResult) {
                case 'success':
                    await expect(inventoryPage.pageTitle).toBeVisible();
                    loginPage.verifySuccessfulLogin();
                    break;

                case 'locked':
                    await expect(loginPage.errorMessage).toHaveText(
                        'Epic sadface: Sorry, this user has been locked out.'
                    );
                    break;

                case 'success_with_issues':
                    await expect(inventoryPage.pageTitle).toBeVisible();
                    loginPage.verifySuccessWithIssuesInventory();
                    break;

                case 'slow_success':
                    const start = Date.now();
                    // Wait for important inventory elements to be visible
                    await expect(loginPage.secondaryHeader).toBeVisible();
                    await expect(loginPage.inventoryList).toBeVisible();

                    const end = Date.now();
                    const loadTime = end - start;
                    console.log(`Performance glitch user inventory loaded in ${loadTime}ms`);
                    loginPage.verifySuccessfulLogin();
                    expect(end - start).toBeGreaterThan(2);
                    if (loadTime < 2) {
                        console.warn('Expected slower load, but it was fast — glitch not observed clearly.');
                    } else {
                        console.log('Performance glitch delay observed as expected.');
                    }
                    break;

                case 'unexpected_errors':
                    // Error user might show random behaviors
                    const isLoggedIn = await inventoryPage.pageTitle.isVisible().catch(() => false);
                    if (!isLoggedIn) {
                        await expect(loginPage.errorMessage).toBeVisible();
                    }
                    break;

                case 'ui_issues':
                    await expect(inventoryPage.pageTitle).toBeVisible();
                    await loginPage.verifyUiIssuesInventory();
                    break;
            }
        });
    });

    // Boundary tests
    test('Invalid credentials show appropriate error', async () => {
        await loginPage.login('invalid', 'credentials');
        await expect(loginPage.errorMessage).toHaveText(
            'Epic sadface: Username and password do not match any user in this service'
        );
    });

    test('Empty credentials show validation errors', async () => {
        await loginPage.login('', '');
        await expect(loginPage.errorMessage).toHaveText(
            'Epic sadface: Username is required'
        );
    });
});