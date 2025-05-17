const { interestRules } = require("../db/memoryDb");
const logger = require("../utils/logger");
const { validateInterestInput } = require("../utils/validator");

async function handleInterestRuleMenu(rl) {
  return new Promise((resolve) => {
    function prompt() {
      rl.question(
        "Please enter interest rules details in <Date> <RuleId> <Rate in %> format\n(or enter blank to go back to main menu):\n> ",
        (line) => {
          const input = line.trim();
          if (!input) return resolve();

          const [date, ruleId, rateStr] = input.split(" ");
          const rate = parseFloat(rateStr);

          const error = validateInterestInput(date, ruleId, rate);
          if (error) {
            console.log(error);
            return prompt();
          }

          interestRules[date] = { ruleId, rate };
          logger.info(`Interest rule added: ${ruleId} at ${rate}%`);
          printRules();
          resolve();
        }
      );
    }

    function printRules() {
      console.log("Interest rules:");
      console.log("| Date     | RuleId | Rate (%) |");
      Object.entries(interestRules)
        .sort(([a], [b]) => a.localeCompare(b))
        .forEach(([date, { ruleId, rate }]) => {
          console.log(`| ${date} | ${ruleId.padEnd(6)} | ${rate.toFixed(2).padStart(8)} |`);
        });
    }

    prompt();
  });
}

module.exports = { handleInterestRuleMenu };
