/**
 * Simplify debts into minimal transactions
 * Algorithm: Match creditors with debtors to minimize number of transactions
 * @param {Object} balances - Object with balances for each member (from calculateBalances)
 * @returns {Array} - Array of transactions {from, to, amount}
 */
export const simplifyDebts = (balances) => {
  // Create arrays of creditors (positive balance) and debtors (negative balance)
  const creditors = [];
  const debtors = [];

  Object.entries(balances).forEach(([memberId, balance]) => {
    if (balance.net > 0.01) {
      // Person is owed money
      creditors.push({
        id: memberId,
        name: balance.name,
        amount: balance.net,
      });
    } else if (balance.net < -0.01) {
      // Person owes money
      debtors.push({
        id: memberId,
        name: balance.name,
        amount: Math.abs(balance.net),
      });
    }
  });

  const transactions = [];

  // Match creditors with debtors
  let creditorIdx = 0;
  let debtorIdx = 0;

  while (creditorIdx < creditors.length && debtorIdx < debtors.length) {
    const creditor = creditors[creditorIdx];
    const debtor = debtors[debtorIdx];

    const settlementAmount = Math.min(creditor.amount, debtor.amount);

    transactions.push({
      from: debtor.name,
      to: creditor.name,
      amount: parseFloat(settlementAmount.toFixed(2)),
      fromId: debtor.id,
      toId: creditor.id,
    });

    creditor.amount -= settlementAmount;
    debtor.amount -= settlementAmount;

    if (creditor.amount < 0.01) {
      creditorIdx++;
    }
    if (debtor.amount < 0.01) {
      debtorIdx++;
    }
  }

  return transactions;
};

/**
 * Get spending breakdown by category
 * @param {Array} expenses - List of expenses
 * @returns {Object} - Breakdown by category with amounts
 */
export const getSpendingBreakdown = (expenses) => {
  const breakdown = {};

  expenses.forEach((expense) => {
    const category = expense.category || 'Other';
    if (!breakdown[category]) {
      breakdown[category] = 0;
    }
    breakdown[category] += expense.amount;
  });

  return breakdown;
};
