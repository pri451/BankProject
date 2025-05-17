const readline = require("readline");
const { handleTransactionMenu } = require("./src/services/transactionService");
const { handleInterestRuleMenu } = require("./src/services/interestService");
const { handlePrintStatementMenu } = require("./src/services/statementService");
const logger = require("./src/utils/logger");
const { initializeDemoData } = require("./src/db/memoryDb");

initializeDemoData();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function showMenu() {
  console.log("\nWelcome to AwesomeGIC Bank! What would you like to do?");
  console.log("[T] Input transactions");
  console.log("[I] Define interest rules");
  console.log("[P] Print statement");
  console.log("[Q] Quit");
  rl.question("> ", async (input) => {
    const choice = input.trim().toUpperCase();
    try {
      switch (choice) {
        case "T":
          await handleTransactionMenu(rl);
          break;
        case "I":
          await handleInterestRuleMenu(rl);
          break;
        case "P":
          await handlePrintStatementMenu(rl);
          break;
        case "Q":
          console.log("Thank you for banking with AwesomeGIC Bank.");
          console.log("Have a nice day!");
          rl.close();
          return;
        default:
          console.log("Invalid option. Try again.");
      }
    } catch (err) {
      logger.error("Unexpected error in menu: ", err);
    }
    showMenu();
  });
}

showMenu();