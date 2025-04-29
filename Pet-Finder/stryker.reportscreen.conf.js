// stryker.reportscreen.conf.js
module.exports = function(config) {
    config.set({
      // 🔹 Only mutate ReportScreen.tsx
      mutate: [
        "app/(tabs)/ReportScreen.tsx"
      ],
  
      // 🔹 All files Stryker needs to load your code & tests
      files: [
        "app/(tabs)/ReportScreen.tsx",
        "test/ReportScreen.test.tsx",
        "jest.config.js",    // your Jest config
        "tsconfig.json"
      ],
  
      // 🔹 Use the TS mutator
      mutator: "typescript",
  
      // 🔹 Run tests with Jest
      testRunner: "jest",
  
      // 🔹 Reporters: real-time dots, console summary, HTML report
      reporters: ["progress", "clear-text", "html"],
  
      // 🔹 Coverage analysis mode
      coverageAnalysis: "perTest",
  
      // 🔹 Jest-specific options
      jest: {
        projectType: "react",       // React Native / Expo
        configFile: "jest.config.js"
      },
  
      // 🔹 Force exactly 1 Jest worker so we actually see progress
      concurrency: 1,
      maxConcurrentTestRunners: 1,
  
      // 🔹 Fail CI if score < 50%
      thresholds: {
        high: 80,
        low: 60,
        break: 50
      }
    });
  };
  