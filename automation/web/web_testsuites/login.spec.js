// tests/login.spec.js
const { test, expect } = require('@playwright/test');
const users = require('../../test-data/userDataProvider.js');
const { WebBaseTest } = require('../web_utilities/webBaseTest');

test.describe('SauceDemo Login Tests - Comprehensive User Validation', () => {
    test.beforeAll(async () => {
        await WebBaseTest.setupClass();
    });

    test.beforeEach(async () => {
        await WebBaseTest.setUp();
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
            const { loginPage, inventoryPage } = WebBaseTest;
            
            // Execute login with the robust LoginPage method
            await loginPage.login(user.username, user.password);

            // Special handling for each user type
            switch(user.expectedResult) {
                case 'success':
                    await expect(inventoryPage.pageTitle).toBeVisible();
                    break;

                case 'locked':
                    await expect(loginPage.errorMessage).toHaveText(
                        'Epic sadface: Sorry, this user has been locked out.'
                    );
                    break;

                case 'success_with_issues':
                    await expect(inventoryPage.pageTitle).toBeVisible();
                    // Additional problem user validations
                    await expect(loginPage.page.locator('.inventory_item_img')).not.toHaveCount(0);
                    break;

                case 'slow_success':
                    await expect(inventoryPage.pageTitle).toBeVisible({ timeout: 20000 });
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
                    // Visual testing integration would go here
                    break;
            }
        });
    });

    // Boundary tests
    test('Invalid credentials show appropriate error', async () => {
        const { loginPage } = WebBaseTest;
        await loginPage.login('invalid', 'credentials');
        await expect(loginPage.errorMessage).toHaveText(
            'Epic sadface: Username and password do not match any user in this service'
        );
    });

    test('Empty credentials show validation errors', async () => {
        const { loginPage } = WebBaseTest;
        await loginPage.login('', '');
        await expect(loginPage.errorMessage).toHaveText(
            'Epic sadface: Username is required'
        );
    });
});