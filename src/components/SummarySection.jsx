import React, { useMemo } from 'react';
import { useExpenseContext } from '../context/ExpenseContext';
import { calculateBalances, calculateTotalSpent } from '../utils/balanceCalculator';
import { simplifyDebts, getSpendingBreakdown } from '../utils/debtSimplifier';
import '../styles/sections.css';

export const SummarySection = () => {
  const { currentGroup } = useExpenseContext();

  const balances = useMemo(() => {
    if (!currentGroup) return {};
    return calculateBalances(currentGroup.expenses, currentGroup.members);
  }, [currentGroup?.expenses, currentGroup?.members]);

  const totalSpent = useMemo(() => {
    if (!currentGroup) return 0;
    return calculateTotalSpent(currentGroup.expenses);
  }, [currentGroup?.expenses]);

  const settlements = useMemo(() => {
    if (!currentGroup) return [];
    return simplifyDebts(balances);
  }, [balances]);

  const spendingBreakdown = useMemo(() => {
    if (!currentGroup) return {};
    return getSpendingBreakdown(currentGroup.expenses);
  }, [currentGroup?.expenses]);

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
        <h3>Summary Dashboard</h3>

        <div className="summary-grid">
          {/* Total Spent Card */}
          <div className="summary-card">
            <h4>Total Spent</h4>
            <div className="summary-value">₹{totalSpent.toFixed(2)}</div>
            <p className="summary-label">{currentGroup.expenses.length} expenses</p>
          </div>

          {/* Members Count Card */}
          <div className="summary-card">
            <h4>Members</h4>
            <div className="summary-value">{currentGroup.members.length}</div>
            <p className="summary-label">in group</p>
          </div>

          {/* Unsettled Debts Card */}
          <div className="summary-card">
            <h4>Debts to Settle</h4>
            <div className="summary-value">{settlements.length}</div>
            <p className="summary-label">transactions</p>
          </div>
        </div>

        {/* Balances */}
        {currentGroup.members.length > 0 && (
          <div className="summary-subsection">
            <h4>Individual Balances</h4>
            {Object.entries(balances).length === 0 ? (
              <p className="empty-placeholder">No members</p>
            ) : (
              <div className="balance-grid">
                {Object.entries(balances).map(([memberId, balance]) => (
                  <div key={memberId} className="balance-card">
                    <div className="balance-name">{balance.name}</div>
                    <div className="balance-metrics">
                      <span className="metric">
                        <span className="label">Paid:</span>
                        <span className="value">₹{balance.paid.toFixed(2)}</span>
                      </span>
                      <span className="metric">
                        <span className="label">Owes:</span>
                        <span className="value">₹{balance.owes.toFixed(2)}</span>
                      </span>
                    </div>
                    <div
                      className={`balance-net ${
                        balance.net > 0.01
                          ? 'positive'
                          : balance.net < -0.01
                          ? 'negative'
                          : 'settled'
                      }`}
                    >
                      {balance.net > 0.01
                        ? `+₹${balance.net.toFixed(2)}`
                        : balance.net < -0.01
                        ? `₹${balance.net.toFixed(2)}`
                        : 'Settled'}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Settlements */}
        {settlements.length > 0 ? (
          <div className="summary-subsection">
            <h4>Who Pays Whom</h4>
            <div className="settlements-list">
              {settlements.map((settlement, index) => (
                <div key={index} className="settlement-card">
                  <div className="settlement-parties">
                    <span className="party from">{settlement.from}</span>
                    <span className="arrow">→</span>
                    <span className="party to">{settlement.to}</span>
                  </div>
                  <div className="settlement-amount">₹{settlement.amount.toFixed(2)}</div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          currentGroup.expenses.length > 0 && (
            <div className="summary-subsection">
              <p className="empty-placeholder">All settled! ✓</p>
            </div>
          )
        )}

        {/* Spending Breakdown */}
        {currentGroup.expenses.length > 0 && Object.keys(spendingBreakdown).length > 0 && (
          <div className="summary-subsection">
            <h4>Spending by Category</h4>
            <div className="breakdown-list">
              {Object.entries(spendingBreakdown)
                .sort((a, b) => b[1] - a[1])
                .map(([category, amount]) => (
                  <div key={category} className="breakdown-item">
                    <span className="category">{category}</span>
                    <div className="breakdown-bar">
                      <div
                        className="breakdown-fill"
                        style={{
                          width: `${(amount / totalSpent) * 100}%`,
                        }}
                      />
                    </div>
                    <span className="amount">₹{amount.toFixed(2)}</span>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Recent Expenses */}
        {currentGroup.expenses.length > 0 && (
          <div className="summary-subsection">
            <h4>Recent Expenses</h4>
            <div className="recent-expenses">
              {currentGroup.expenses.slice(-5).reverse().map((expense) => {
                const paidByMember = currentGroup.members.find((m) => m.id === expense.paidBy);
                return (
                  <div key={expense.id} className="expense-row">
                    <div className="expense-info">
                      <span className="description">{expense.description}</span>
                      <span className="category-badge">{expense.category}</span>
                    </div>
                    <div className="expense-meta">
                      <span className="paid-by">
                        {paidByMember?.name || 'Unknown'}
                      </span>
                      <span className="amount">₹{expense.amount.toFixed(2)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
