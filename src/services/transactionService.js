const { accounts } = require("../db/memoryDb");
const logger = require("../utils/logger");
const { validateTransactionInput } = require("../utils/validator");

async function handleTransactionMenu(rl) {
  return new Promise((resolve) => {
    function prompt() {
      rl.question(
        "Please enter transaction details in <Date> <Account> <Type> <Amount> format\n(or enter blank to go back to main menu):\n> ",
        (line) => {
          const input = line.trim();
          if (!input) return resolve();

          const [date, account, type, amountStr] = input.split(" ");
          const amount = parseFloat(amountStr);

          const error = validateTransactionInput(date, account, type, amount);
          if (error) {
            console.log(error);
            return prompt();
          }

          if (!accounts[account]) accounts[account] = { transactions: [] };

          const balance = accounts[account].transactions.reduce((acc, t) => {
            return t.type === "D" || t.type === "I" ? acc + t.amount : acc - t.amount;
          }, 0);

          if (type.toUpperCase() === "W" && balance < amount) {
            console.log("Insufficient balance.");
            return prompt();
          }

          const txnCount = accounts[account].transactions.filter(t => t.date === date).length + 1;
          const txnId = `${date}-${String(txnCount).padStart(2, "0")}`;
          accounts[account].transactions.push({
            date,
            type: type.toUpperCase(),
            amount,
            txnId,
          });

          logger.info(`Transaction recorded: ${txnId} ${type} ${amount}`);
          printStatement(account);
          resolve();
        }
      );
    }

    function printStatement(account) {
      console.log(`Account: ${account}`);
      console.log("| Date     | Txn Id      | Type | Amount |");
      accounts[account].transactions.forEach((t) => {
        console.log(
          `| ${t.date} | ${t.txnId.padEnd(11)} | ${t.type.padEnd(4)} | ${t.amount.toFixed(2).padStart(6)} |`
        );
      });
    }

    prompt();
  });
}

module.exports = { handleTransactionMenu };
