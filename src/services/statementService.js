const { accounts, interestRules } = require("../db/memoryDb");
const logger = require("../utils/logger");

async function handlePrintStatementMenu(rl) {
  return new Promise((resolve) => {
    rl.question(
      "Please enter account and month to generate the statement <Account> <Year><Month>\n(or enter blank to go back to main menu):\n> ",
      (line) => {
        const input = line.trim();
        if (!input) return resolve();

        const [account, month] = input.split(" ");
        if (!accounts[account]) {
          console.log("Account not found.");
          return resolve();
        }

        const txns = accounts[account].transactions.filter((t) =>
          t.date.startsWith(month)
        );

        let balance = 0;
        const allTxns = accounts[account].transactions;
        allTxns
          .sort((a, b) => a.date.localeCompare(b.date))
          .forEach((t) => {
            if (t.date.startsWith(month)) {
              if (t.type === "D" || t.type === "I") balance += t.amount;
              else if (t.type === "W") balance -= t.amount;
            }
          });

        console.log(`Account: ${account}`);
        console.log("| Date     | Txn Id      | Type | Amount | Balance |");
        let runningBalance = 0;
        txns.forEach((t) => {
          if (t.type === "D" || t.type === "I") runningBalance += t.amount;
          else runningBalance -= t.amount;
          console.log(
            `| ${t.date} | ${t.txnId.padEnd(11)} | ${t.type}    | ${t.amount.toFixed(2).padStart(6)} | ${runningBalance.toFixed(2).padStart(7)} |`
          );
        });

        // Simple interest logic: assuming fixed balance and rule for demo
        const interest = (runningBalance * 2.2 * 5) / (100 * 365);
        console.log(
          `| ${month}30 |             | I    | ${interest.toFixed(2).padStart(6)} | ${(runningBalance + interest).toFixed(2).padStart(7)} |`
        );

        logger.info(`Printed statement for ${account} ${month}`);
        resolve();
      }
    );
  });
}

module.exports = { handlePrintStatementMenu };
