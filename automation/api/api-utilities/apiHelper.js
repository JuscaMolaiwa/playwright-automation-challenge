const { expect } = require('@playwright/test');
const { faker } = require('@faker-js/faker'); 

class APIHelper {
  constructor(request) {
    this.request = request;
  }

  async generateAuthToken() {
    const response = await this.request.post('/auth', {
      data: {
        username: 'admin',
        password: 'password123'
      }
    });
    expect(response.ok()).toBeTruthy();
    return await response.json();
  }

  async createBooking(bookingData) {
    const response = await this.request.post('/booking', {
      data: bookingData
    });
    expect(response.ok()).toBeTruthy();
    return await response.json();
  }

  async getBooking(bookingId) {
    return await this.request.get(`/booking/${bookingId}`);
  }

  async updateBooking(bookingId, data, token, method = 'put') {
    const headers = {
      'Cookie': `token=${token}`
    };
    
    const response = await this.request[method](`/booking/${bookingId}`, {
      data,
      headers
    });
    
    expect(response.ok()).toBeTruthy();
    return await response.json();
  }

  async deleteBooking(bookingId, token) {
    const response = await this.request.delete(`/booking/${bookingId}`, {
      headers: {
        'Cookie': `token=${token}`
      }
    });
    expect(response.status()).toBe(201);
  }
}

module.exports = APIHelper;