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
                const playwrightConfig = require('../playwright.config.js');
                environment = playwrightConfig.environmentConfig.env;
            } catch (e) {
                console.warn('Playwright config not available for environment lookup');
            }
        }

        return environment || 'LOCAL_ENVIRONMENT'; // Default to LOCAL_ENVIRONMENT
    }

    /**
     * Gets environment-specific configuration
     * @returns {Object} Environment config object
     */
    static getEnvironmentConfig() {
        try {
            const playwrightConfig = require('../playwright.config.js');
            const env = this.getEnvironment();
            return playwrightConfig.environmentConfig.environments[env] || {};
        } catch (e) {
            console.warn('Failed to get environment config:', e.message);
            return {};
        }
    }
}

module.exports = { WebHelperMethods };