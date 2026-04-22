import React, { useMemo } from 'react';
import { useExpenseContext } from '../context/ExpenseContext';
import { calculateTotalSpent } from '../utils/balanceCalculator';
import { getSpendingBreakdown } from '../utils/debtSimplifier';
import '../styles/sections.css';

export const SummarySection = () => {
  const { currentGroup } = useExpenseContext();

  const totalSpent = useMemo(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    if (!currentGroup) return 0;
    return calculateTotalSpent(currentGroup.expenses);
  }, [currentGroup]);

  const spendingBreakdown = useMemo(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    if (!currentGroup) return {};
    return getSpendingBreakdown(currentGroup.expenses);
  }, [currentGroup]);

  const insights = useMemo(() => {
    if (!currentGroup || !currentGroup.expenses.length) return {};

    // Top spender
    const memberSpending = {};
    currentGroup.members.forEach(member => {
      memberSpending[member.id] = { name: member.name, paid: 0 };
    });

    currentGroup.expenses.forEach(expense => {
      if (memberSpending[expense.paidBy]) {
        memberSpending[expense.paidBy].paid += expense.amount;
      }
    });

    const topSpender = Object.values(memberSpending).reduce((max, member) =>
      member.paid > max.paid ? member : max, { paid: 0 });

    // Most spent category
    const mostSpentCategory = Object.entries(spendingBreakdown).reduce((max, [category, amount]) =>
      amount > max.amount ? { category, amount } : max, { amount: 0 });

    return {
      topSpender: topSpender.paid > 0 ? topSpender : null,
      mostSpentCategory: mostSpentCategory.amount > 0 ? mostSpentCategory : null,
      totalTransactions: currentGroup.expenses.length,
    };
  }, [currentGroup, spendingBreakdown]);

  if (!currentGroup) {
    return (
      <section className="dashboard-section summary-section">
        <div className="section-content">
          <p className="empty-placeholder">Select a group to view summary</p>
        </div>
      </section>
    );
  }

  return (
    <section className="dashboard-section summary-section">
      <div className="section-content">
        <h3>Summary</h3>

        <div className="summary-grid">
          {/* Total Spent Card */}
          <div className="summary-card">
            <div className="summary-row">
              <span className="summary-label">Total Spent</span>
              <span className="summary-value">₹{totalSpent.toFixed(0)}</span>
            </div>
            <div className="summary-subtext">{insights.totalTransactions} transactions</div>
          </div>

          {/* Members Count Card */}
          <div className="summary-card">
            <div className="summary-row">
              <span className="summary-label">Members</span>
              <span className="summary-value">{currentGroup.members.length}</span>
            </div>
            <div className="summary-subtext">in group</div>
          </div>

          {/* Top Spender Card */}
          {insights.topSpender && (
            <div className="summary-card">
              <div className="summary-row">
                <span className="summary-label">Top Spender</span>
                <span className="summary-value-name">{insights.topSpender.name}</span>
              </div>
              <div className="summary-subtext">₹{insights.topSpender.paid.toFixed(0)} paid</div>
            </div>
          )}

          {/* Most Spent Category Card */}
          {insights.mostSpentCategory && (
            <div className="summary-card">
              <div className="summary-row">
                <span className="summary-label">Top Category</span>
                <span className="summary-value-name">{insights.mostSpentCategory.category}</span>
              </div>
              <div className="summary-subtext">₹{insights.mostSpentCategory.amount.toFixed(0)} spent</div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
