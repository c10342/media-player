const path = require("path");

module.exports = {
  testEnvironment: "jsdom",
  moduleFileExtensions: ["ts", "json", "js"],
  transform: {
    ".*\\.(ts)$": "ts-jest",
    ".+\\.(css|styl|less|sass|scss)$": "jest-css-modules-transform"
  },
  moduleNameMapper: {
    "^@lin-media/(.*)$": "<rootDir>/packages/$1/index.ts"
  },
  rootDir: path.join(__dirname),
  testMatch: [
    // 匹配测试用例的文件
    "<rootDir>/packages/**/__tests__/*.test.ts"
  ],
  collectCoverageFrom: ["<rootDir>/packages/**/src/*.ts"],
  setupFiles: [
    "<rootDir>/tests/__mocks__/ResizeObserver.ts",
    "<rootDir>/tests/__mocks__/video.ts"
  ]
};
