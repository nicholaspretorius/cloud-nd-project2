module.exports = {
  verbose: true,
  testEnvironment: "node",
  coveragePathIgnorePatterns: ["/node_modules/"],
  testPathIgnorePatterns: [],
  moduleFileExtensions: ["ts", "tsx", "js"],
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest"
  },
  globals: {
    "ts-jest": {
      tsConfigFile: "tsconfig.json"
    }
  },
  testMatch: ["**/tests/*.+(ts|tsx|js)"]
};
