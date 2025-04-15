const path = require('path');
const fs = require('fs');
const { TestLogger } = require('../../shared-utils/testLogger.js');
const { BrowserOptions } = require('../web_utilities/BrowserOptions.js');
const playwrightConfig = require('../playwright.config.js');
import { LoginPage } from '../pages/login.page.js';
import { InventoryPage } from '../pages/InventoryPage';
class WebBaseTest {


    // Playwright instances
    static playwright;
    static browser;
    static context;
    static page;

    // Page objects
    static loginPage;
    static inventoryPage
    static URL = playwrightConfig.use.baseURL;


    static async setupClass() {
        try {
            this.playwright = await require('playwright').playwright;
            await TestLogger.logTestResult('INFO', 'Successfully initialized Playwright');
        } catch (e) {
            throw new Error(`Failed to setup Playwright: ${e.message}`);
        }
    }

    static async setUp() {
        await this.initializingBrowser();
        await this.initializePageObjects();

    }

    static async tearDown() {
        await this.closeContext();
    }

    static async tearDownClass() {
        await this.closeBrowser();
    }

    static async initializingBrowser() {
        try {
            // Initialize browser
            this.browser = await BrowserOptions.initializeBrowser();
            this.context = await this.browser.newContext();
            this.page = await this.context.newPage();
            await this.page.goto(this.URL, { waitUntil: 'networkidle' });
        } catch (e) {
            await TestLogger.logTestResult('SEVERE', `Browser initialization error: ${e.message}`);
            throw new Error(`Failed to initialize browser: ${e.message}`);
        }
    }

    static async initializePageObjects() {
        this.loginPage = new LoginPage(this.page);
        this.inventoryPage = new InventoryPage(this.page);
        await TestLogger.logTestResult(
            'INFO', `successfully: initialized page objects`);
    }

    static async closeContext() {
        try {
            if (this.context) {
                await this.context.close();
            }
        } catch (e) {
            await TestLogger.logTestResult('SEVERE', `Failed to close browser context: ${e.message}`);
        }
    }

    static async closeBrowser() {
        try {
            if (this.browser) {
                await this.browser.close();
            }
            if (this.playwright) {
                await this.playwright.close();
            }
        } catch (e) {
            await TestLogger.logTestResult('SEVERE', `Failed to close browser: ${e.message}`);
        }
    }


    // Metod to capture the screeensot for debugging and proof with test class and test name as arguments
    static async captureScreenshot(testClassName, testName) {
        try {
            const screenshotFile = this.createScreenshotFile(testClassName, testName);
            await this.page.screenshot({
                path: screenshotFile.path,
                fullPage: true
            });
            await TestLogger.logTestResult('INFO', `Screenshot captured successfully: ${screenshotFile.path}`);
        } catch (e) {
            await TestLogger.logTestResult('SEVERE', `Failed to capture screenshot: ${e.message}`);
        }
    }

    static createScreenshotFile(testClassName, testName) {
        const screenshotDirectory = path.join(process.cwd(), 'web-screenshots');
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        if (!fs.existsSync(screenshotDirectory)) {
            fs.mkdirSync(screenshotDirectory, { recursive: true });
        }

        const classDirectory = path.join(screenshotDirectory, testClassName);
        if (!fs.existsSync(classDirectory)) {
            fs.mkdirSync(classDirectory, { recursive: true });
        }

        let count = 0;
        let screenshotPath;
        do {
            count++;
            const fileName = count === 1
                ? `${testName}_${timestamp}`
                : `${testName}${count}_${timestamp}`;
            screenshotPath = path.join(classDirectory, `${fileName}.png`);
        } while (fs.existsSync(screenshotPath));

        return {
            path: screenshotPath,
            directory: classDirectory
        };
    }
}

module.exports = { WebBaseTest };