const { faker } = require('@faker-js/faker');

module.exports = {
  generateBookingData: () => ({
    firstname: faker.person.firstName(),
    lastname: faker.person.lastName(),         
    totalprice: faker.number.int({ min: 50, max: 1000 }), 
    depositpaid: faker.datatype.boolean(),
    bookingdates: {
      checkin: faker.date.future({ years: 0.1 }).toISOString().split('T')[0],
      checkout: faker.date.future({ years: 0.2 }).toISOString().split('T')[0]
    },
    additionalneeds: faker.helpers.arrayElement(['Breakfast', 'WiFi', 'Parking', 'Airport Shuttle'])
  }),

  defaultBookingPayload: {
    firstname: "John",
    lastname: "Doe",
    totalprice: 123,
    depositpaid: true,
    bookingdates: {
      checkin: "2023-01-01",
      checkout: "2023-01-05"
    },
    additionalneeds: "Breakfast"
  }
};