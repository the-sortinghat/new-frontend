const nextJest = require("next/jest");

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: "./",
});

// Add any custom config to be passed to Jest
const customJestConfig = {
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  testEnvironment: "jest-environment-jsdom",
  moduleNameMapper: {
    "^@components(.*)$": "<rootDir>/components/$1",
    "^@contexts(.*)$": "<rootDir>/contexts/$1",
    "^@hooks(.*)$": "<rootDir>/hooks/$1",
    "^@pages(.*)$": "<rootDir>/pages/$1",
    "^@services(.*)$": "<rootDir>/services/$1",
    "^@styles(.*)$": "<rootDir>/styles/$1",
    "^@model(.*)$": "<rootDir>/model/$1",
    "^@common(.*)$": "<rootDir>/common/$1",
    "^@views(.*)$": "<rootDir>/views/$1",
  },
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig);
