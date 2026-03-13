const {
  getBalance,
  creditAmount,
  debitAmount,
  resetBalance,
} = require('./index');

describe('Accounting app business logic', () => {
  beforeEach(async () => {
    await resetBalance();
  });

  test('TC-01: View initial balance', async () => {
    const balance = await getBalance();
    expect(balance).toBe(1000);
  });

  test('TC-02: Credit account positive amount', async () => {
    const result1 = await creditAmount(250);
    expect(result1.success).toBe(true);
    expect(result1.balance).toBeCloseTo(1250);

    const balance = await getBalance();
    expect(balance).toBeCloseTo(1250);
  });

  test('TC-03: Debit account with sufficient funds', async () => {
    await creditAmount(250); // bring to 1250 to follow plan context
    const result2 = await debitAmount(250);
    expect(result2.success).toBe(true);
    expect(result2.balance).toBeCloseTo(1000);

    const balance = await getBalance();
    expect(balance).toBeCloseTo(1000);
  });

  test('TC-04: Debit account with insufficient funds', async () => {
    const result = await debitAmount(1500);
    expect(result.success).toBe(false);
    expect(result.message).toBe('Insufficient funds for this debit.');

    const balance = await getBalance();
    expect(balance).toBeCloseTo(1000);
  });

  test('Invalid amount handling in credit/debit', async () => {
    const negativeCredit = await creditAmount(-5);
    expect(negativeCredit.success).toBe(false);
    expect(negativeCredit.message).toBe('Invalid credit amount. Must be a non-negative number.');

    const negativeDebit = await debitAmount(-10);
    expect(negativeDebit.success).toBe(false);
    expect(negativeDebit.message).toBe('Invalid debit amount. Must be a non-negative number.');

    const balance = await getBalance();
    expect(balance).toBeCloseTo(1000);
  });
});
