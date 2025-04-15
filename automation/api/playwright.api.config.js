const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './automation/api/api_testsuites',
  testMatch: '**/*.test.js',
  timeout: 30000,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['html', { outputFolder: 'api-test-results' }]],
  use: {
    baseURL: 'https://restful-booker.herokuapp.com',
    extraHTTPHeaders: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    trace: 'on-first-retry',
  },
  reporter: [
    ['list'],
    ['html', { outputFolder: 'api-test-results' }]
  ],
  projects: [
    {
      name: 'api',
    }
  ]
});