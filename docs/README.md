# COBOL Student Account System Documentation

## Overview
This repository contains a simple COBOL-based student account management system. It provides a console menu for viewing the account balance, crediting, and debiting amounts.

## Directory Structure
- `src/cobol/main.cob` - main user interface and menu loop
- `src/cobol/operations.cob` - business logic for account operations
- `src/cobol/data.cob` - in-memory pseudo data store for balance

---

## File Purpose

### `main.cob`
- Program ID: `MainProgram`
- Purpose: Interactive menu for the student account system.
- Main loop:
  - 1: View Balance
  - 2: Credit Account
  - 3: Debit Account
  - 4: Exit
- Delegates work to `Operations` program using `CALL 'Operations' USING ...` with operation codes.

### `operations.cob`
- Program ID: `Operations`
- Purpose: Implement operations requested by the main menu.
- Key business paths:
  - `TOTAL` (view current balance)
  - `CREDIT` (add amount to balance)
  - `DEBIT` (subtract amount if sufficient funds)
- Uses `DataProgram` to read/write `FINAL-BALANCE`.
- Prompts user for credit/debit amounts and displays success/error messages.

### `data.cob`
- Program ID: `DataProgram`
- Purpose: Hold the account balance in working-storage and act as an abstraction for persistent data operations.
- Operation codes:
  - `READ`: copy internal `STORAGE-BALANCE` to caller-provided `BALANCE`
  - `WRITE`: update internal `STORAGE-BALANCE` with caller `BALANCE`
- Initial balance set to `1000.00`.

---

## Key Functions and Flow
1. `MainProgram` queries user input and calls `Operations`.
2. `Operations` resolves operation type and interacts with `DataProgram`:
   - For balance checks: `CALL 'DataProgram' USING 'READ', FINAL-BALANCE`
   - For credits: read, add, write back (with `WRITE`), show new balance
   - For debits: read, validate funds, subtract, write back, or reject for insufficient funds
3. `DataProgram` manages `STORAGE-BALANCE` as single account state.

---

## Business Rules (Student Accounts)
- Starting balance is `1000.00`.
- Credit adds the entered amount to balance and persists it.
- Debit only allowed if the current balance is greater than or equal to the requested withdrawal.
- Debit with insufficient funds prints: `Insufficient funds for this debit.` (no state change)
- Menu selection outside 1-4 prints error and continues loop.
- Selecting 4 exits the application.

---

## Notes
- This implementation uses in-memory state (`WORKING-STORAGE`) and does not persist beyond process execution.
- For real student account systems, consider adding:
  - multi-user account records
  - secure input validation and overflow checks
  - persistent storage (file/database)
  - decimal rounding and currency formatting

---

## Sequence Diagram (Mermaid)
```mermaid
sequenceDiagram
    participant User
    participant MainProgram
    participant Operations
    participant DataProgram

    User->>MainProgram: choose option (1-4)
    MainProgram->>Operations: CALL 'Operations' USING operation-code
    alt option == TOTAL
        Operations->>DataProgram: CALL 'DataProgram' USING 'READ', FINAL-BALANCE
        DataProgram-->>Operations: return FINAL-BALANCE
        Operations-->>User: display balance
    else option == CREDIT
        Operations-->>User: prompt credit amount
        User-->>Operations: provides AMOUNT
        Operations->>DataProgram: CALL 'DataProgram' USING 'READ', FINAL-BALANCE
        DataProgram-->>Operations: return FINAL-BALANCE
        Operations: FINAL-BALANCE += AMOUNT
        Operations->>DataProgram: CALL 'DataProgram' USING 'WRITE', FINAL-BALANCE
        Operations-->>User: display new balance
    else option == DEBIT
        Operations-->>User: prompt debit amount
        User-->>Operations: provides AMOUNT
        Operations->>DataProgram: CALL 'DataProgram' USING 'READ', FINAL-BALANCE
        DataProgram-->>Operations: return FINAL-BALANCE
        alt FINAL-BALANCE >= AMOUNT
            Operations: FINAL-BALANCE -= AMOUNT
            Operations->>DataProgram: CALL 'DataProgram' USING 'WRITE', FINAL-BALANCE
            Operations-->>User: display new balance
        else
            Operations-->>User: display insufficient funds
        end
    else option == EXIT
        MainProgram-->>User: exit message
    end
```

