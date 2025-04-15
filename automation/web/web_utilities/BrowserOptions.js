const { chromium, firefox, webkit } = require('playwright');
const { TestLogger } = require('../../shared-utils/testLogger.js');
const { WebHelperMethods } = require('../../web/web_utilities/webHelperMethods.js');

class BrowserOptions {
    static BROWSERS = {
        CHROME: 'chrome',
        FIREFOX: 'firefox',
        SAFARI: 'safari',
        EDGE: 'edge'
    };

    static DEFAULT_BROWSER = this.BROWSERS.CHROME;

    /**
     * Gets the configured browser choice
     * @returns {string} Browser name
     */
    static getBrowserChoice() {
        // Try environment variable first
        let browser = process.env.BROWSER?.toLowerCase();
        
        // Validate browser choice
        if (browser && Object.values(this.BROWSERS).includes(browser)) {
            return browser;
        }
        
        TestLogger.logTestResult('WARNING', 
            `Invalid browser choice: ${browser}. Defaulting to ${this.DEFAULT_BROWSER}`);
        return this.DEFAULT_BROWSER;
    }

    /**
     * Initializes the Playwright browser with proper configuration
     * @returns {Promise<Browser>} Playwright browser instance
     */
    static async initializeBrowser() {
        try {
            const browserChoice = this.getBrowserChoice();
            const environment = WebHelperMethods.getEnvironment();
            
            const browserType = this.getBrowserType(browserChoice);
            const launchOptions = this.getLaunchOptions(browserChoice, environment);

            const browser = await browserType.launch(launchOptions);
            await TestLogger.logTestResult(
                'INFO',
                `Browser launched: ${browserChoice} v${browser.version()}`
            );
            return browser;
            
        } catch (e) {
            await TestLogger.logTestResult('SEVERE', `Browser init failed: ${e.stack}`);
            throw new Error(`Browser initialization failed: ${e.message}`);
        }
    }

    static getBrowserType(browserChoice) {
        const browserMap = {
            [this.BROWSERS.CHROME]: chromium,
            [this.BROWSERS.FIREFOX]: firefox,
            [this.BROWSERS.SAFARI]: webkit,
            [this.BROWSERS.EDGE]: chromium
        };
        return browserMap[browserChoice] || chromium;
    }

    static getLaunchOptions(browserChoice, environment) {
        const options = {
            headless: this.shouldRunHeadless(environment),
            args: this.getBrowserArgs(browserChoice, environment)
        };
        
        // Chrome/Edge specific options
        if ([this.BROWSERS.CHROME, this.BROWSERS.EDGE].includes(browserChoice)) {
            options.channel = browserChoice === this.BROWSERS.EDGE ? 'msedge' : 'chrome';
        }
        
        return options;
    }

    static shouldRunHeadless(environment) {
        return !['local', 'development'].includes(environment?.toLowerCase());
    }

    static getBrowserArgs(browser, environment) {
        const args = [
            '--ignore-certificate-errors',
            '--ignore-ssl-errors',
            '--disable-blink-features=AutomationControlled'
        ];

        const isCI = environment?.toLowerCase() === 'ci';
        const isChromium = [this.BROWSERS.CHROME, this.BROWSERS.EDGE].includes(browser);

        if (isChromium) {
            args.push(
                '--remote-allow-origins=*',
                '--start-maximized',
                ...(isCI ? [
                    '--no-sandbox',
                    '--disable-dev-shm-usage',
                    '--headless=new'
                ] : [])
            );
        }

        return args;
    }
}

module.exports = { BrowserOptions };