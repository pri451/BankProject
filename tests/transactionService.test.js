const { handleTransactionMenu } = require("../src/services/transactionService");
const { accounts } = require("../src/db/memoryDb");
const logger = require("../src/utils/logger");

jest.mock("../src/utils/logger");

describe("handleTransactionMenu", () => {
  let rl;
  let consoleLogSpy;

  beforeEach(() => {
    // Reset in-memory db
    for (const key in accounts) delete accounts[key];

    // Mock rl.question to be replaced per test
    rl = { question: jest.fn() };

    // Spy on console.log to suppress and track output
    consoleLogSpy = jest.spyOn(console, "log").mockImplementation(() => {});

    // Clear logger mocks
    logger.info.mockClear();
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
  });

  test("adds a valid deposit transaction", async () => {
    // Input sequence: valid deposit, then blank to exit
    rl.question
      .mockImplementationOnce((prompt, cb) => cb("20230715 AC001 D 100"))
      .mockImplementationOnce((prompt, cb) => cb(""));

    await handleTransactionMenu(rl);

    expect(accounts).toHaveProperty("AC001");
    expect(accounts["AC001"].transactions).toHaveLength(1);

    const txn = accounts["AC001"].transactions[0];
    expect(txn).toMatchObject({
      date: "20230715",
      type: "D",
      amount: 100,
      txnId: "20230715-01",
    });

    expect(logger.info).toHaveBeenCalledWith("Transaction recorded: 20230715-01 D 100");

    // console.log called at least for printStatement header
    expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining("Account: AC001"));
  });

  test("rejects invalid input and re-prompts", async () => {
    const inputs = [
      "bad input",           // invalid (split less than 4 parts)
      "20230715 AC001 X 50", // invalid type
      "20230715 AC001 W 50", // valid withdrawal
      "",                    // exit
    ];

    let callCount = 0;
    rl.question.mockImplementation((prompt, cb) => {
      cb(inputs[callCount++]);
    });

    // Seed account with deposit so withdrawal has balance
    accounts["AC001"] = { transactions: [{ date: "20230701", type: "D", amount: 100, txnId: "20230701-01" }] };

    await handleTransactionMenu(rl);

    expect(accounts["AC001"].transactions).toHaveLength(2);

    // Last txn should be withdrawal with 50
    const lastTxn = accounts["AC001"].transactions[1];
    expect(lastTxn).toMatchObject({
      date: "20230715",
      type: "W",
      amount: 50,
    });

    // logger called once for successful transaction only
    expect(logger.info).toHaveBeenCalledWith(expect.stringContaining("Transaction recorded:"));

    // console.log called to print error messages and statements
    expect(consoleLogSpy).toHaveBeenCalled();
  });

});
