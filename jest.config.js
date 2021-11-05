module.exports = {
  verbose: true,
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testRegex: 'test.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  maxWorkers: 1,
  coverageDirectory: './coverage/jest',
  testEnvironment: 'node',
  moduleNameMapper: {
		"@src/(.*)": "<rootDir>/src/$1",
    "@fixtures/(.*)": "<rootDir>/src/__tests__/fixtures/$1",
		"@services/(.*)": "<rootDir>/src/services/$1"
  },
};
