# Test Plan: COBOL Student Account System

This test plan validates the business logic currently implemented in the COBOL app, including balance read, credit, debit, and menu controls.

| Test Case ID | Test Case Description | Pre-conditions | Test Steps | Expected Result | Actual Result | Status (Pass/Fail) | Comments |
|--------------|-----------------------|----------------|------------|-----------------|---------------|-------------------|----------|
| TC-01 | View initial balance | Program started, default balance 1000.00 | 1) Start program 2) Select option 1 | Display `Current balance: 1000.00` | | | |
| TC-02 | Credit account positive amount | Program started, balance 1000.00 | 1) Start program 2) Select option 2 3) Enter 250.00 | Display new balance `1250.00`; balance persisted | | | |
| TC-03 | Debit account with sufficient funds | Balance 1250.00 (after TC-02) | 1) Start program 2) Select option 3 3) Enter 250.00 | Display new balance `1000.00`; balance persisted | | | |
| TC-04 | Debit account with insufficient funds | Balance 1000.00 | 1) Start program 2) Select option 3 3) Enter 1500.00 | Display `Insufficient funds for this debit.`; balance remains `1000.00` | | | |
| TC-05 | Invalid menu option handling | Program started | 1) Start program 2) Enter 5 | Display `Invalid choice, please select 1-4.` | | | |
| TC-06 | Exit command | Program started | 1) Start program 2) Enter 4 | Displays exit message and terminates | | | |

## Notes
- `Actual Result` values should be filled during execution by tester.
- `Status` should be marked Pass/Fail after comparing expected vs actual behavior.
- This plan can be used to guide future Node.js unit/integration tests and acceptance tests.
