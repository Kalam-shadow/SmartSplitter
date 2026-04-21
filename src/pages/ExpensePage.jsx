import React from 'react';
import { useExpenseContext } from '../context/ExpenseContext';
import { ExpenseForm } from '../components/ExpenseForm';
import { BalanceList } from '../components/BalanceList';
import '../styles/pages.css';

export const ExpensePage = ({ onNavigate }) => {
  const { currentGroup } = useExpenseContext();

  if (!currentGroup) {
    return (
      <div className="page">
        <h1>Add Expense</h1>
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
      <h1>Expense Management</h1>
      <p className="group-name">Group: <strong>{currentGroup.name}</strong></p>

      <div className="two-column">
        <div className="section">
          <h2>Add Expense</h2>
          <ExpenseForm />
        </div>

        <div className="section">
          <h2>Current Balances</h2>
          <BalanceList
            expenses={currentGroup.expenses}
            members={currentGroup.members}
          />
        </div>
      </div>

      <div className="button-group">
        <button className="btn btn-secondary" onClick={() => onNavigate('group')}>
          ← Back to Groups
        </button>
        <button className="btn btn-primary" onClick={() => onNavigate('summary')}>
          View Summary →
        </button>
      </div>
    </div>
  );
};
