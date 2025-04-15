// --- utils/requestHelper.js ---
const request = require('supertest');

const baseUrl = 'https://restful-booker.herokuapp.com';

module.exports = {
  post: (endpoint, data, token = '') =>
    request(baseUrl)
      .post(endpoint)
      .set('Content-Type', 'application/json')
      .set('Cookie', token ? `token=${token}` : '')
      .send(data),

  get: (endpoint) =>
    request(baseUrl)
      .get(endpoint),

  put: (endpoint, data, token) =>
    request(baseUrl)
      .put(endpoint)
      .set('Content-Type', 'application/json')
      .set('Cookie', `token=${token}`)
      .send(data),

  patch: (endpoint, data, token) =>
    request(baseUrl)
      .patch(endpoint)
      .set('Content-Type', 'application/json')
      .set('Cookie', `token=${token}`)
      .send(data),

  del: (endpoint, token) =>
    request(baseUrl)
      .delete(endpoint)
      .set('Cookie', `token=${token}`)
};