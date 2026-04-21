/**
 * Calculate balances from expenses
 * Handles equal splits with proper rounding, custom splits with validation,
 * and includes safety checks for missing members and invalid data.
 * 
 * @param {Array} expenses - List of expenses
 * @param {Array} members - List of group members
 * @returns {Object} - Object with balances for each member {id: {name, paid, owes, net}}
 */
export const calculateBalances = (expenses, members) => {
  const balances = {};

  // Initialize balances for all members
  members.forEach((member) => {
    balances[member.id] = {
      name: member.name,
      paid: 0,
      owes: 0,
      net: 0,
    };
  });

  // Validate inputs
  if (!expenses || !Array.isArray(expenses)) {
    return balances;
  }

  // Process each expense
  expenses.forEach((expense) => {
    // SAFETY CHECK 1: Validate expense structure
    if (!expense || typeof expense !== 'object') {
      console.warn('Invalid expense object:', expense);
      return;
    }

    // SAFETY CHECK 2: Validate amount is a number
    const amount = Number(expense.amount) || 0;
    if (amount <= 0) {
      console.warn('Expense amount must be positive:', amount);
      return;
    }

    // SAFETY CHECK 3: Validate payer exists
    if (!expense.paidBy || !balances[expense.paidBy]) {
      console.warn('Expense payer not found:', expense.paidBy);
      return;
    }

    // SAFETY CHECK 4: Validate participants exist and are not empty
    if (!expense.participants || !Array.isArray(expense.participants) || expense.participants.length === 0) {
      console.warn('Expense must have at least one participant');
      return;
    }

    // Add to paid amount
    balances[expense.paidBy].paid += amount;

    // Process split
    if (expense.splitType === 'equal') {
      // EQUAL SPLIT with proper rounding
      const participantCount = expense.participants.length;
      const baseSplit = Math.floor((amount * 100) / participantCount) / 100; // Floor base split
      const remainder = amount - baseSplit * participantCount; // Remainder to account for rounding

      expense.participants.forEach((participantId, index) => {
        // SAFETY CHECK 5: Validate participant exists
        if (!balances[participantId]) {
          console.warn('Participant not found:', participantId);
          return;
        }

        // Assign remainder to first participant to ensure amounts sum exactly
        const participantShare = index === 0 ? baseSplit + remainder : baseSplit;
        balances[participantId].owes += parseFloat(participantShare.toFixed(2));
      });
    } else if (expense.splitType === 'custom') {
      // CUSTOM SPLIT with validation
      const customAmounts = expense.customAmounts || {};

      // VALIDATION: Ensure custom amounts sum to expense amount (with 0.01 tolerance for floats)
      const totalCustom = Object.values(customAmounts).reduce((sum, val) => {
        return sum + (Number(val) || 0);
      }, 0);

      if (Math.abs(totalCustom - amount) > 0.01) {
        console.warn(
          `Custom split mismatch: expected ₹${amount}, got ₹${totalCustom.toFixed(2)}`
        );
        return;
      }

      // Apply custom amounts
      expense.participants.forEach((participantId) => {
        // SAFETY CHECK 5: Validate participant exists
        if (!balances[participantId]) {
          console.warn('Participant not found:', participantId);
          return;
        }

        const customAmount = Number(customAmounts[participantId]) || 0;
        balances[participantId].owes += parseFloat(customAmount.toFixed(2));
      });
    }
  });

  // Calculate and normalize net balance for all members
  Object.keys(balances).forEach((memberId) => {
    const paid = parseFloat(balances[memberId].paid.toFixed(2));
    const owes = parseFloat(balances[memberId].owes.toFixed(2));
    balances[memberId].paid = paid;
    balances[memberId].owes = owes;
    balances[memberId].net = parseFloat((paid - owes).toFixed(2));
  });

  return balances;
};

/**
 * Calculate total spent across all expenses
 * Safely handles type coercion and invalid data
 * 
 * @param {Array} expenses - List of expenses
 * @returns {number} - Total amount spent (normalized to 2 decimals)
 */
export const calculateTotalSpent = (expenses) => {
  if (!expenses || !Array.isArray(expenses)) {
    return 0;
  }

  const total = expenses.reduce((sum, expense) => {
    if (!expense || typeof expense !== 'object') {
      return sum;
    }

    const amount = Number(expense.amount) || 0;
    return sum + Math.max(0, amount); // Ensure no negative amounts
  }, 0);

  return parseFloat(total.toFixed(2));
};

/**
 * Get expense categorization based on keywords
 * Uses keyword matching on description to auto-categorize
 * 
 * @param {string} description - Expense description
 * @returns {string} - Category (Food, Travel, Rent, Entertainment, Utilities, Other)
 */
export const categorizeExpense = (description) => {
  // Type safety: ensure description is a string
  const desc = String(description || '').toLowerCase().trim();

  if (!desc) {
    return 'Other';
  }

  // Food categories
  if (
    desc.includes('food') ||
    desc.includes('eat') ||
    desc.includes('lunch') ||
    desc.includes('dinner') ||
    desc.includes('breakfast') ||
    desc.includes('restaurant') ||
    desc.includes('pizza') ||
    desc.includes('burger') ||
    desc.includes('grocery') ||
    desc.includes('market')
  ) {
    return 'Food';
  }

  // Travel categories
  if (
    desc.includes('travel') ||
    desc.includes('train') ||
    desc.includes('bus') ||
    desc.includes('car') ||
    desc.includes('taxi') ||
    desc.includes('uber') ||
    desc.includes('flight') ||
    desc.includes('hotel') ||
    desc.includes('transport')
  ) {
    return 'Travel';
  }

  // Rent/Accommodation categories
  if (
    desc.includes('rent') ||
    desc.includes('house') ||
    desc.includes('accommodation') ||
    desc.includes('lodge') ||
    desc.includes('airbnb') ||
    desc.includes('booking')
  ) {
    return 'Rent';
  }

  // Entertainment categories
  if (
    desc.includes('entertainment') ||
    desc.includes('movie') ||
    desc.includes('show') ||
    desc.includes('game') ||
    desc.includes('cinema') ||
    desc.includes('concert') ||
    desc.includes('tickets')
  ) {
    return 'Entertainment';
  }

  // Utilities categories
  if (
    desc.includes('utility') ||
    desc.includes('electricity') ||
    desc.includes('water') ||
    desc.includes('internet') ||
    desc.includes('phone') ||
    desc.includes('bill')
  ) {
    return 'Utilities';
  }

  return 'Other';
};
