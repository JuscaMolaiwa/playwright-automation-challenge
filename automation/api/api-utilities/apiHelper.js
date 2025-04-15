const { expect } = require('@playwright/test');
const fs = require('fs');
      const path = require('path');
      const { format } = require('date-fns');

class APIHelper {
  /**
   * @param {import('@playwright/test').APIRequestContext} request
   * @param {string} baseURL
   */
  constructor(request, baseURL) {
    this.request = request;
    this.baseURL = baseURL.endsWith('/') ? baseURL.slice(0, -1) : baseURL;
  }

  async generateAuthToken() {
    const response = await this.request.post(`${this.baseURL}/auth`, {
      data: {
        username: 'admin',
        password: 'password123'
      }
    });
    expect(response.ok()).toBeTruthy();
    return await response.json();
  }

  async createBooking(bookingData) {
    const response = await this.request.post(`${this.baseURL}/booking`,{
      data: bookingData
    });
    expect(response.ok()).toBeTruthy();
    return await response.json();
  }

  async getBooking(bookingId) {
    return await this.request.get(`${this.baseURL}/booking/${bookingId}`);
  }

  async updateBooking(bookingId, data, token, method = 'put') {
    const headers = {
      'Cookie': `token=${token}`
    };
    
    const response = await this.request[method](`${this.baseURL}/booking/${bookingId}`, {
      data,
      headers
    });
    
    expect(response.ok()).toBeTruthy();
    return await response.json();
  }

  async deleteBooking(bookingId, token) {
    const response = await this.request.delete(`${this.baseURL}/booking/${bookingId}`, {
      headers: {
        'Cookie': `token=${token}`
      }
    });
    expect(response.status()).toBe(201);
  }

  /**
   * Stores the last API response to a JSON file
   * @param {string} testName - Name of the test for directory organization
   * @returns {string} Path to the saved file
   */
  async storeLastResponse(testName) {
    if (!this.lastResponse) {
      throw new Error('No response available to store');
    }
    
    const responseBody = await this.lastResponse.json();
    return this.storeJsonElement(responseBody, testName);
  }

  /**
   * Stores any JSON data to file
   * @param {Object} jsonData - The JSON data to store
   * @param {string} testName - Test name for directory
   * @param {string} scenario - Scenario identifier
   * @returns {string} Path to saved file
   */
  storeJsonElement(jsonData, testName, scenario) {
    try {
    
      const jsonDirectory = path.join(
        process.cwd(), 
        'api-responses', 
        testName.toLowerCase()
      );
      
      if (!fs.existsSync(jsonDirectory)) {
        fs.mkdirSync(jsonDirectory, { recursive: true });
      }

      const timestamp = format(new Date(), 'yyyy-MM-dd_HH-mm-ss');
      const fileName = `${testName}_${scenario}_${timestamp}.json`;
      const filePath = path.join(jsonDirectory, fileName);

      const prettyJson = JSON.stringify(jsonData, null, 2);
      fs.writeFileSync(filePath, prettyJson);

      console.log(`\x1b[33mJSON data stored: ${filePath}\x1b[0m`);
      return filePath;
    } catch (error) {
      console.error('\x1b[31mFailed to store JSON:', error.message, '\x1b[0m');
      throw error;
    }
  }
}

module.exports = APIHelper;