# Banking CLI Application

This project is a simple command-line banking application implemented in Node.js.  
It supports managing accounts, transactions, interest rate rules, and generating account statements.

---

## Features

- Manage accounts with deposits (`D`), withdrawals (`W`), and interest (`I`) transactions.
- Define and update interest rate rules effective from given dates.
- Generate monthly account statements showing transactions, balances, and interest calculation.
- Input validation for transactions and interest rules.
- In-memory data storage for demo and testing.

---

## Project Structure

- `src/db/memoryDb.js`  
  In-memory storage for accounts and interest rules with demo data initialization.

- `src/services/transactionService.js`  
  Handles the transaction menu: input, validation, balance checking, and transaction recording.

- `src/services/interestService.js`  
  Handles the interest rule menu: input, validation, and rule recording.

- `src/services/statementService.js`  
  Handles printing account statements by month with transactions and interest summary.

- `src/utils/validator.js`  
  Input validation functions for transactions and interest rules.

- `src/utils/logger.js`  
  Simple logger for informational and error messages.

- `tests/`  
  Contains Mocha/Chai test files for unit testing the services.

---

## Getting Started

### Prerequisites

- Node.js (version 14+ recommended)
- npm or yarn package manager

### Installation

1. Clone the repo:
   ```bash
   git clone https://github.com/yourusername/banking-cli.git
   cd banking-cli
