const { handleInterestRuleMenu } = require("../src/services/interestService");
const { interestRules } = require("../src/db/memoryDb");
const logger = require("../src/utils/logger");

jest.mock("../src/utils/logger");

describe("handleInterestRuleMenu", () => {
  let rl;
  let consoleLogSpy;

  beforeEach(() => {
    for (const key in interestRules) delete interestRules[key];

    rl = { question: jest.fn() };

    consoleLogSpy = jest.spyOn(console, "log").mockImplementation(() => {});

    logger.info.mockClear();
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
  });

  test("adds a valid interest rule", async () => {
    rl.question
      .mockImplementationOnce((prompt, cb) => cb("20230701 RULE01 3.5"))
      .mockImplementationOnce((prompt, cb) => cb(""));

    await handleInterestRuleMenu(rl);

    expect(interestRules).toHaveProperty("20230701");
    expect(interestRules["20230701"]).toEqual({ ruleId: "RULE01", rate: 3.5 });

    expect(logger.info).toHaveBeenCalledWith("Interest rule added: RULE01 at 3.5%");

    expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining("Interest rules:"));
  });

  test("rejects invalid input and re-prompts", async () => {
    const inputs = [
      "bad input",
      "20230701 RULE02 -1",
      "20230701 RULE02 2.75",
      "",
    ];

    let callCount = 0;
    rl.question.mockImplementation((prompt, cb) => {
      cb(inputs[callCount++]);
    });

    await handleInterestRuleMenu(rl);

    expect(interestRules).toHaveProperty("20230701");
    expect(interestRules["20230701"]).toEqual({ ruleId: "RULE02", rate: 2.75 });

    expect(logger.info).toHaveBeenCalledWith("Interest rule added: RULE02 at 2.75%");

    expect(consoleLogSpy).toHaveBeenCalled();
  });
});
