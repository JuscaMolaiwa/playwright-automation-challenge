# Playwright API Automation Framework

![Playwright Logo](https://playwright.dev/img/playwright-logo.svg)

A comprehensive automation testing framework for both web API testing using Playwright.


### API Testing
- API testing
- Authentication testing
- Request/response storage

## Prerequisites

- Node.js v16+
- npm v8+ or yarn
- Git

## Installation

```bash
# Clone repository
git clone https://github.com/yourusername/playwright-automation-challenge.git
```

# Install dependencies
```bash
npm install
```

# Install Playwright browsers and dependencies
```bash
npx playwright install
npm install date-fns --save-dev
```


## Running Tests
- Specific Test Suite:

```bash
npx playwright test automation/api/api_testsuites/createBooking.test.js --reporter=html 
```

- To run all tests, execute the following command:
```bash
npx playwright test --reporter=html
```

- Run tests in parallel (e.g., with 4 workers):

```bash
npx playwright test --workers=4
```