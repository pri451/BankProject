function validateTransactionInput(date, account, type, amount) {
  if (!isValidDate(date)) return "Invalid date format.";
    if (!account) return "Account name is required.";
    if (!["D", "W", "d", "w"].includes(type)) return "Invalid type. Use D or W.";
    if (isNaN(amount) || amount <= 0) return "Amount must be > 0.";
    if (!/^\d+(\.\d{1,2})?$/.test(amount.toString())) return "Amount must have max 2 decimals.";
    return null;
  }
  
  function validateInterestInput(date, ruleId, rate) {
    if (!isValidDate(date)) return "Invalid date format.";
    if (!ruleId) return "Rule ID is required.";
    if (isNaN(rate) || rate <= 0 || rate >= 100) return "Rate must be between 0 and 100.";
    return null;
  }
  
  function isValidDate(dateStr) {
    // Check pattern YYYYMMdd
    if (!/^\d{8}$/.test(dateStr)) return false;
  
    const year = parseInt(dateStr.slice(0, 4), 10);
    const month = parseInt(dateStr.slice(4, 6), 10);
    const day = parseInt(dateStr.slice(6, 8), 10);
  
    // Months in JS Date are 0-based (0=Jan, ..., 11=Dec)
    const date = new Date(year, month - 1, day);
  
    // Check if date components match input (to catch invalid dates like Feb 30)
    return (
      date.getFullYear() === year &&
      date.getMonth() === month - 1 &&
      date.getDate() === day
    );
  }
  
  module.exports = { validateTransactionInput, validateInterestInput };
  