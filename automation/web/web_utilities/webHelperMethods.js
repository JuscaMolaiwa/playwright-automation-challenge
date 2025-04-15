const playwrightConfig = require('../playwright.config.js');

class WebHelperMethods {

    /**
     * Reusable method to fetch the environment value
     * Checks system properties, environment variables, and Playwright config
     * @returns {string} The environment value
     */
    static getEnvironment() {
        // Try environment variables first
        let environment = process.env.ENV || null;
        
        // If not found, try Playwright config
        if (!environment) {
            try {
                environment = playwrightConfig.use.env;
            } catch (e) {
                console.warn('Playwright config not available for environment lookup');
            }
        }

        return environment || 'LOCAL_ENVIRONMENT'; // Default to LOCAL_ENVIRONMENT
    }
}

module.exports = { WebHelperMethods };