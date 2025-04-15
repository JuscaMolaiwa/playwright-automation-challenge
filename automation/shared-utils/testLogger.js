// utils/testLogger.js

const ConsoleColors = {
    RESET: "\x1b[0m",
    GREEN: "\x1b[32m",
  };
  
  class TestLogger {
    /**
     * Logs the test result with specified level and message.
     *
     * @param {string} level - Logging level: 'info', 'warn', 'error', etc.
     * @param {string} message - The message to log.
     * @param  {...any} params - Additional params to include in the message.
     */
    static logTestResult(level, message, ...params) {
      const isSuccess =
        message.startsWith("Test Passed") || message.toLowerCase().includes("success");
  
      const formattedMessage = isSuccess
        ? `${ConsoleColors.GREEN}${message}${ConsoleColors.RESET}`
        : message;
  
      switch (level.toLowerCase()) {
        case "info":
          console.info(formattedMessage, ...params);
          break;
        case "warn":
          console.warn(formattedMessage, ...params);
          break;
        case "error":
        case "severe":
          console.error(formattedMessage, ...params);
          break;
        default:
          console.log(formattedMessage, ...params);
      }
    }
  }
  
  module.exports = { TestLogger };
  