// playwright.config.js
module.exports = {
  testDir: 'automation/web/web_testsuites',
  testMatch: '*.spec.js',
  retries: 0,
  timeout: 30000,
  use: {
    headless: true,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    baseURL: 'https://www.saucedemo.com',
    browserName: 'Chrome',
    env: 'LOCAL_ENVIRONMENT'
  },
};
