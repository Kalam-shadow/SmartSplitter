/**
 * Simplify debts into minimal transactions
 * Algorithm: Match creditors with debtors to minimize number of transactions
 * 
 * Uses a greedy approach:
 * 1. Separate members into creditors (owed money) and debtors (owe money)
 * 2. Match largest debts with available credits
 * 3. Minimize total number of transactions
 * 
 * @param {Object} balances - Object with balances for each member (from calculateBalances)
 * @returns {Array} - Array of transactions {from, to, amount, fromId, toId}
 */
export const simplifyDebts = (balances) => {
  // Validate input
  if (!balances || typeof balances !== 'object') {
    console.warn('Invalid balances object:', balances);
    return [];
  }

  // Create arrays of creditors (positive balance) and debtors (negative balance)
  const creditorsRaw = [];
  const debtorsRaw = [];

  Object.entries(balances).forEach(([memberId, balance]) => {
    // Validate balance object
    if (!balance || typeof balance !== 'object') {
      console.warn('Invalid balance for member:', memberId);
      return;
    }

    const net = Number(balance.net) || 0;

    // Use 0.01 as threshold to account for floating-point errors
    if (net > 0.01) {
      // Person is owed money
      creditorsRaw.push({
        id: memberId,
        name: String(balance.name || 'Unknown'),
        amount: parseFloat(net.toFixed(2)),
      });
    } else if (net < -0.01) {
      // Person owes money
      debtorsRaw.push({
        id: memberId,
        name: String(balance.name || 'Unknown'),
        amount: parseFloat(Math.abs(net).toFixed(2)),
      });
    }
  });

  // Clone arrays to avoid mutating originals
  const creditors = creditorsRaw.map(obj => ({ ...obj }));
  const debtors = debtorsRaw.map(obj => ({ ...obj }));

  // Sort by amount descending for optimal matching
  creditors.sort((a, b) => b.amount - a.amount);
  debtors.sort((a, b) => b.amount - a.amount);

  // Global consistency check
  const totalCredit = creditors.reduce((s, c) => s + c.amount, 0);
  const totalDebt = debtors.reduce((s, d) => s + d.amount, 0);
  if (Math.abs(totalCredit - totalDebt) > 0.05) {
    console.warn('Imbalance detected in simplifyDebts:', { totalCredit, totalDebt });
  }

  const transactions = [];

  // Match creditors with debtors using greedy algorithm
  let creditorIdx = 0;
  let debtorIdx = 0;

  while (creditorIdx < creditors.length && debtorIdx < debtors.length) {
    const creditor = creditors[creditorIdx];
    const debtor = debtors[debtorIdx];

    // Settle minimum of what creditor is owed and what debtor owes
    const settlementAmount = Math.min(creditor.amount, debtor.amount);

    // Round to 2 decimal places to avoid floating-point errors
    const roundedAmount = parseFloat(settlementAmount.toFixed(2));

    if (roundedAmount > 0.01) {
      transactions.push({
        from: debtor.name,
        to: creditor.name,
        amount: roundedAmount,
        fromId: debtor.id,
        toId: creditor.id,
      });
    }

    // Update remaining amounts (safe mutation of clones)
    creditor.amount = parseFloat((creditor.amount - settlementAmount).toFixed(2));
    debtor.amount = parseFloat((debtor.amount - settlementAmount).toFixed(2));

    // Move to next creditor if current one is fully paid (safer <= check)
    if (creditor.amount <= 0.01) {
      creditorIdx++;
    }

    // Move to next debtor if current one has fully paid (safer <= check)
    if (debtor.amount <= 0.01) {
      debtorIdx++;
    }
  }

  return transactions;
};

/**
 * Get spending breakdown by category
 * Aggregates total spending for each category
 * 
 * @param {Array} expenses - List of expenses
 * @returns {Object} - Breakdown by category with amounts (normalized to 2 decimals)
 */
export const getSpendingBreakdown = (expenses) => {
  // Validate input
  if (!expenses || !Array.isArray(expenses)) {
    return {};
  }

  const breakdown = {};

  expenses.forEach((expense) => {
    // Validate expense object
    if (!expense || typeof expense !== 'object') {
      console.warn('Invalid expense object:', expense);
      return;
    }

    // Get category, default to 'Other'
    const category = String(expense.category || 'Other').trim() || 'Other';

    // Validate amount is a number
    const amount = Number(expense.amount) || 0;

    if (amount > 0) {
      if (!breakdown[category]) {
        breakdown[category] = 0;
      }

      breakdown[category] += amount;
    }
  });

  // Normalize all values to 2 decimal places
  Object.keys(breakdown).forEach((category) => {
    breakdown[category] = parseFloat(breakdown[category].toFixed(2));
  });

  return breakdown;
};
