const { test, expect } = require('@playwright/test');
const APIHelper = require('../../api-utilities/apiHelper');
const playwrightConfig = require('../../playwright.api.config');

test.describe('Authentication Tests', () => {
  let apiHelper;
  let baseURL;

  test.beforeEach(async ({ request }) => {
    baseURL = playwrightConfig.use.baseURL;
    apiHelper = new APIHelper(request, baseURL);
  });

  test('should generate a valid auth token', async () => {
    const tokenData = await apiHelper.generateAuthToken();
    expect(tokenData.token).toBeTruthy();
    expect(typeof tokenData.token).toBe('string');
  });

  test('should fail with invalid credentials', async () => {
    const response = await apiHelper.request.post(`${baseURL}/auth`, {
      data: {
        username: 'invalid',
        password: 'invalid'
      }
    });
    
    // This API returns 200 even for invalid credentials
    expect(response.status()).toBe(200);
    
    const responseBody = await response.json();
    expect(responseBody.reason).toBe('Bad credentials');
  });
});