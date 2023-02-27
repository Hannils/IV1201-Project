module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  moduleDirectories: ["node_modules", "src"],
  moduleNameMapper: {
    "#(.*)": "<rootDir>/node_modules/$1"
  },
  modulePaths: ["<rootDir>"],
  testRegex: '\/__tests__\/.*\.test.ts'
};