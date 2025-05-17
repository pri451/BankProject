// src/db/memoryDb.js

const accounts = {};
const interestRules = {};

function initializeDemoData() {
  // Preload accounts
  accounts["AC001"] = {
    transactions: [
      { date: "20230505", type: "D", amount: 100, txnId: "20230505-01" },
      { date: "20230601", type: "D", amount: 150, txnId: "20230601-01" },
      { date: "20230626", type: "W", amount: 20, txnId: "20230626-01" },
      { date: "20230626", type: "W", amount: 100, txnId: "20230626-02" },
    ],
  };

  // Preload interest rules
  interestRules["20230101"] = { ruleId: "RULE01", rate: 1.95 };
  interestRules["20230520"] = { ruleId: "RULE02", rate: 1.9 };
  interestRules["20230615"] = { ruleId: "RULE03", rate: 2.2 };
}

module.exports = {
  accounts,
  interestRules,
  initializeDemoData,
};
