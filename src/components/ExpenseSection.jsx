import React from 'react';
import { useExpenseContext } from '../context/ExpenseContext';
import { ExpenseForm } from '../components/ExpenseForm';
import '../styles/sections.css';

export const ExpenseSection = () => {
  const { currentGroup } = useExpenseContext();

  return (
    <section className="dashboard-section expense-section">
      <div className="section-content">
        <h3>Add Expense</h3>

        {!currentGroup ? (
          <div className="empty-placeholder">
            <p>Create or select a group and add members first</p>
          </div>
        ) : currentGroup.members.length === 0 ? (
          <div className="empty-placeholder">
            <p>Add members to the group before creating expenses</p>
          </div>
        ) : (
          <ExpenseForm />
        )}
      </div>
    </section>
  );
};
