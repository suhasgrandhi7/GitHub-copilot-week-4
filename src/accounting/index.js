#!/usr/bin/env node

const readline = require('readline');

const INITIAL_BALANCE = 1000.0;
let storageBalance = INITIAL_BALANCE;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function displayMenu() {
  console.log('--------------------------------');
  console.log('Account Management System');
  console.log('1. View Balance');
  console.log('2. Credit Account');
  console.log('3. Debit Account');
  console.log('4. Exit');
  console.log('--------------------------------');
}

function prompt(question) {
  return new Promise((resolve) => rl.question(question, (answer) => resolve(answer.trim())));
}

async function run() {
  let continueFlag = true;

  while (continueFlag) {
    displayMenu();

    const choice = await prompt('Enter your choice (1-4): ');
    switch (choice) {
      case '1':
        await total();
        break;

      case '2':
        await credit();
        break;

      case '3':
        await debit();
        break;

      case '4':
        continueFlag = false;
        break;

      default:
        console.log('Invalid choice, please select 1-4.');
    }
  }

  console.log('Exiting the program. Goodbye!');
  rl.close();
}

async function total() {
  const finalBalance = await dataProgram('READ');
  console.log(`Current balance: ${finalBalance.toFixed(2)}`);
}

async function credit() {
  const amountStr = await prompt('Enter credit amount: ');
  const amount = parseFloat(amountStr);
  if (Number.isNaN(amount) || amount < 0) {
    console.log('Invalid credit amount. Must be a non-negative number.');
    return;
  }

  let balance = await dataProgram('READ');
  balance += amount;
  await dataProgram('WRITE', balance);

  console.log(`Amount credited. New balance: ${balance.toFixed(2)}`);
}

async function debit() {
  const amountStr = await prompt('Enter debit amount: ');
  const amount = parseFloat(amountStr);
  if (Number.isNaN(amount) || amount < 0) {
    console.log('Invalid debit amount. Must be a non-negative number.');
    return;
  }

  let balance = await dataProgram('READ');
  if (balance >= amount) {
    balance -= amount;
    await dataProgram('WRITE', balance);
    console.log(`Amount debited. New balance: ${balance.toFixed(2)}`);
  } else {
    console.log('Insufficient funds for this debit.');
  }
}

async function dataProgram(op, newBalance = null) {
  if (op === 'READ') {
    return storageBalance;
  }

  if (op === 'WRITE') {
    storageBalance = newBalance;
    return storageBalance;
  }

  throw new Error(`Unsupported operation: ${op}`);
}

function getBalance() {
  return dataProgram('READ');
}

async function creditAmount(amount) {
  if (typeof amount !== 'number' || Number.isNaN(amount) || amount < 0) {
    return { success: false, message: 'Invalid credit amount. Must be a non-negative number.' };
  }

  let balance = await dataProgram('READ');
  balance += amount;
  await dataProgram('WRITE', balance);

  return { success: true, balance };
}

async function debitAmount(amount) {
  if (typeof amount !== 'number' || Number.isNaN(amount) || amount < 0) {
    return { success: false, message: 'Invalid debit amount. Must be a non-negative number.' };
  }

  let balance = await dataProgram('READ');
  if (balance >= amount) {
    balance -= amount;
    await dataProgram('WRITE', balance);
    return { success: true, balance };
  }

  return { success: false, message: 'Insufficient funds for this debit.' };
}

async function resetBalance(amount = INITIAL_BALANCE) {
  await dataProgram('WRITE', amount);
  return amount;
}

if (require.main === module) {
  run().catch((err) => {
    console.error('Unexpected error:', err);
    rl.close();
    process.exit(1);
  });
}

module.exports = {
  run,
  total,
  credit,
  debit,
  dataProgram,
  getBalance,
  creditAmount,
  debitAmount,
  resetBalance,
};
