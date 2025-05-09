# Web Automation Testing

![Playwright Logo](https://playwright.dev/img/playwright-logo.svg)

A robust automation testing framework built with Playwright for end-to-end testing of web applications.

## Features

- Cross-browser testing (Chromium, Firefox, WebKit)
- Comprehensive reporting (HTML, JSON, JUnit)
- Visual regression testing
- Parallel test execution
- Modular test architecture

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running Tests](#running-tests)
- [Test Reporting](#test-reporting)
- [Test Strategies](#test-strategies)
- [Folder Structure](#folder-structure)
- [Contributing](#contributing)
- [License][def]

## Prerequisites

Before you begin, ensure that you have met the following requirements:

- **Node.js**: Version 14 or above.
- **Playwright**: For browser automation.
- **Git**: For version control.
- **Package manager**: npm or yarn for dependency management.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/playwright-automation-challenge.git

2. Install dependencies:

```bash
npm install
npx playwright install
npm install date-fns --save-dev 
```

## Running Tests
- Specific Test Suite:

```bash
npx playwright test automation/web/web_testsuites/login.spec.js --reporter=html
```

- To run all tests, execute the following command:
```bash
npx playwright test --reporter=html
```

- Run tests in parallel (e.g., with 4 workers):

```bash
npx playwright test --workers=4
```

## Test Reporting

Once the tests are executed, Playwright will generate a test report (default in test-results folder). To view it:

1. Open the generated test-report.html file.
2. Use the following command to view a test run summary in the terminal:

```bash
npx playwright show-report
```

## Test Data

Test data is often provided dynamically (e.g., using a userDataProvider.js file for different test cases like valid/invalid login credentials). This makes it easy to manage and extend test cases.


## Contributing

Contributions are welcome! Feel free to fork the repo and submit pull requests.

[def]: #license