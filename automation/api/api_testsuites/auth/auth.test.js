const { test, expect } = require('@playwright/test');
const APIHelper = require('../../api-utilities/apiHelper.js');

test.describe('Authentication Tests', () => {
  let apiHelper;

  test.beforeEach(async ({ request }) => {
    apiHelper = new APIHelper(request);
  });

  test('should generate a valid auth token', async () => {
    const tokenData = await apiHelper.generateAuthToken();
    expect(tokenData.token).toBeTruthy();
    expect(typeof tokenData.token).toBe('string');
  });

  test('should fail with invalid credentials', async ({ request }) => {
    const response = await request.post('/auth', {
      data: {
        username: 'invalid',
        password: 'invalid'
      }
    });
    expect(response.ok()).toBeFalsy();
    const responseBody = await response.json();
    expect(responseBody.reason).toBe('Bad credentials');
  });
});