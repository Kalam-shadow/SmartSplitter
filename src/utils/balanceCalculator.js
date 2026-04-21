/**
 * Calculate balances from expenses
 * @param {Array} expenses - List of expenses
 * @param {Array} members - List of group members
 * @returns {Object} - Object with balances for each member
 */
export const calculateBalances = (expenses, members) => {

    if (!expense.participants || expense.participants.length === 0) return;
    const balances = {};

    // Initialize balances
    members.forEach((member) => {
        balances[member.id] = {
            name: member.name,
            paid: 0,
            owes: 0,
            net: 0,
        };
    });

    // Process each expense
    expenses.forEach((expense) => {
        // Add to paid amount
        balances[expense.paidBy].paid += expense.amount;

        // Calculate split amount
        let splitAmount;
        if (expense.splitType === 'equal') {
            rawSplit = expense.amount / expense.participants.length;
            splitAmount = Math.round(rawSplit * 100) / 100; // Round to 2 decimals
        }

        // Add to owes amount
        expense.participants.forEach((participantId) => {
            if (expense.splitType === 'equal') {
                balances[participantId].owes += splitAmount;
            } else {
                // custom split
                const customAmount = expense.customAmounts[participantId] || 0;
                balances[participantId].owes += customAmount;
            }
        });
    });

    // Calculate net balance
    Object.keys(balances).forEach((memberId) => {
        balances[memberId].net = balances[memberId].paid - balances[memberId].owes;
    });

    return balances;
};

/**
 * Calculate total spent across all expenses
 * @param {Array} expenses - List of expenses
 * @returns {number} - Total amount
 */
export const calculateTotalSpent = (expenses) => {
    return expenses.reduce((sum, expense) => sum + expense.amount, 0);
};

/**
 * Get expense categorization based on keywords
 * @param {string} description - Expense description
 * @returns {string} - Category
 */
export const categorizeExpense = (description) => {
    const lowerDesc = description.toLowerCase();

    if (
        lowerDesc.includes('food') ||
        lowerDesc.includes('eat') ||
        lowerDesc.includes('lunch') ||
        lowerDesc.includes('dinner') ||
        lowerDesc.includes('breakfast') ||
        lowerDesc.includes('restaurant') ||
        lowerDesc.includes('pizza') ||
        lowerDesc.includes('burger')
    ) {
        return 'Food';
    }

    if (
        lowerDesc.includes('travel') ||
        lowerDesc.includes('train') ||
        lowerDesc.includes('bus') ||
        lowerDesc.includes('car') ||
        lowerDesc.includes('taxi') ||
        lowerDesc.includes('uber') ||
        lowerDesc.includes('flight')
    ) {
        return 'Travel';
    }

    if (
        lowerDesc.includes('rent') ||
        lowerDesc.includes('house') ||
        lowerDesc.includes('accommodation') ||
        lowerDesc.includes('hotel')
    ) {
        return 'Rent';
    }

    if (
        lowerDesc.includes('entertainment') ||
        lowerDesc.includes('movie') ||
        lowerDesc.includes('show') ||
        lowerDesc.includes('game')
    ) {
        return 'Entertainment';
    }

    if (
        lowerDesc.includes('utility') ||
        lowerDesc.includes('electricity') ||
        lowerDesc.includes('water')
    ) {
        return 'Utilities';
    }

    return 'Other';
};
