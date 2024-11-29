module.exports = {
    testEnvironment: "node",
    testMatch: ["**/__tests__/**/*.test.js", "**/?(*.)+(spec|test).js"],
    verbose: true,
    transform: {
      "^.+\\.[tj]sx?$": "babel-jest", // Transform modern JS/TS
    },
    moduleDirectories: ["node_modules", "src"], // Allow imports from `src` directory
  };
  