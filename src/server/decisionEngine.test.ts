import { runDecisionEngineTests } from "./diagnosticsRunner";

console.log("=========================================");
console.log("RUNNING STADIUMSENSE AI TEST SUITE");
console.log("=========================================");

runDecisionEngineTests()
  .then((result) => {
    for (const detail of result.details) {
      if (detail.passed) {
        console.log(`[PASS] ${detail.name}`);
      } else {
        console.log(`[FAIL] ${detail.name}`);
        if (detail.errorDetails) {
          console.log(`  - Error: ${detail.errorDetails}`);
        }
      }
    }
    console.log("-----------------------------------------");
    console.log(`Suite result: ${result.passed}/${result.total} tests passed successfully.`);
    console.log("=========================================");
    if (result.passed !== result.total) {
      process.exit(1);
    }
    process.exit(0);
  })
  .catch((err) => {
    console.error("Failed to execute test suite CLI runner:", err);
    process.exit(1);
  });
