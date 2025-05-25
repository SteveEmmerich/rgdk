module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom', // Use jsdom for browser-like environment, helpful for PIXI.js if it needs DOM elements
  moduleNameMapper: {
    // If you have module aliases in tsconfig.json, map them here
    // e.g., '^@core/(.*)$': '<rootDir>/src/core/$1'
  },
  // Automatically clear mock calls and instances between every test
  clearMocks: true,
};
