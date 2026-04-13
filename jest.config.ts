import type {Config} from 'jest';

const config: Config = {
  bail: true,

  clearMocks: true,

  coverageProvider: "v8",

  preset: "ts-jest",

  testEnvironment: "node",

  roots: ["<rootDir>/src"],

  testMatch: ["**/*.test.{ts,js}"],

  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
};

export default config;
