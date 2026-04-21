import React, { useMemo } from 'react';
import { useExpenseContext } from '../context/ExpenseContext';
import { BalanceList } from '../components/BalanceList';
import { getSpendingBreakdown } from '../utils/debtSimplifier';
import '../styles/pages.css';

export const SummaryPage = ({ onNavigate }) => {
  const { currentGroup } = useExpenseContext();

  const spendingBreakdown = useMemo(() => {
    if (!currentGroup) return {};
    return getSpendingBreakdown(currentGroup.expenses);
  }, [currentGroup]);

  if (!currentGroup) {
    return (
      <div className="page">
        <h1>Balance Summary</h1>
        <div className="empty-state">
          <p>No group selected. Please create or select a group first.</p>
          <button className="btn btn-primary" onClick={() => onNavigate('group')}>
            ← Back to Groups
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <h1>Balance Summary</h1>
      <p className="group-name">Group: <strong>{currentGroup.name}</strong></p>

      {/* Main Balance Information */}
      <div className="section">
        <BalanceList
          expenses={currentGroup.expenses}
          members={currentGroup.members}
        />
      </div>

      {/* Spending Breakdown */}
      {currentGroup.expenses.length > 0 && (
        <div className="section">
          <h2>Spending Breakdown by Category</h2>
          <div className="breakdown-items">
            {Object.entries(spendingBreakdown).map(([category, amount]) => (
              <div key={category} className="breakdown-item">
                <span className="category-name">{category}</span>
                <span className="category-amount">₹{amount.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Expenses List */}
      {currentGroup.expenses.length > 0 && (
        <div className="section">
          <h2>All Expenses</h2>
          <div className="expenses-list">
            {currentGroup.expenses.map((expense) => {
              const paidByMember = currentGroup.members.find(
                (m) => m.id === expense.paidBy
              );
              return (
                <div key={expense.id} className="expense-item">
                  <div className="expense-header">
                    <span className="expense-description">
                      {expense.description}
                      <span className="expense-category">{expense.category}</span>
                    </span>
                    <span className="expense-amount">₹{expense.amount.toFixed(2)}</span>
                  </div>
                  <div className="expense-details">
                    <span>Paid by: <strong>{paidByMember?.name}</strong></span>
                    <span>
                      Split: <strong>{expense.splitType === 'equal' ? 'Equal' : 'Custom'}</strong>
                    </span>
                    <span>
                      Participants: <strong>{expense.participants.length}</strong>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="button-group">
        <button className="btn btn-secondary" onClick={() => onNavigate('expenses')}>
          ← Back to Expenses
        </button>
        <button className="btn btn-secondary" onClick={() => onNavigate('group')}>
          Back to Groups
        </button>
      </div>
    </div>
  );
};
