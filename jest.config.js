export default {
  testEnvironment: "node",
  transform: {
    "^.+\\.js$": "babel-jest",
  },
  collectCoverageFrom: ["src/**/*.js", "!src/thirdparty/**/*.js"],
  coverageDirectory: "coverage",
  coverageReporters: ["text", "lcov", "html"],
};
