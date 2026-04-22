import React from 'react';
import { useExpenseContext } from '../context/ExpenseContext';
import '../styles/sections.css';

export const ExpenseList = () => {
  const { currentGroup, deleteExpense, startEditing, editingExpense } = useExpenseContext();

  if (!currentGroup) {
    return (
      <section className="dashboard-section expense-list-section">
        <div className="section-content">
          <h3>Expenses</h3>
          <div className="empty-placeholder">
            <p>Select a group to view expenses</p>
          </div>
        </div>
      </section>
    );
  }

  const expenses = currentGroup.expenses || [];
  const members = currentGroup.members || [];

  // Helper function to get member name by ID
  const getMemberName = (memberId) => {
    const member = members.find(m => m.id === memberId);
    return member ? member.name : 'Unknown';
  };

  const handleEdit = (expense) => {
    startEditing(expense);
  };

  const handleDelete = (expenseId) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      deleteExpense(expenseId);
    }
  };

  return (
    <section className="dashboard-section expense-list-section">
      <div className="section-content">
        <div className="expense-list-header">
          <h3>Expenses ({expenses.length})</h3>
        </div>

        {expenses.length === 0 ? (
          <div className="empty-placeholder">
            <p>No expenses yet. Add one using the form.</p>
          </div>
        ) : (
          <div className="expense-list-container">
            <div className="expense-list-table">
              <div className="expense-list-header-row">
                <div className="expense-col description">Description</div>
                <div className="expense-col paid-by">Paid By</div>
                <div className="expense-col amount">Amount (₹)</div>
                <div className="expense-col category">Category</div>
                <div className="expense-col date">Date</div>
                <div className="expense-col actions">Actions</div>
              </div>

              <div className="expense-list-body">
                {expenses.map((expense) => (
                  <div
                    key={expense.id}
                    className={`expense-list-row ${editingExpense && editingExpense.id === expense.id ? 'editing' : ''}`}
                  >
                    <div className="expense-col description">{expense.description}</div>
                    <div className="expense-col paid-by">{getMemberName(expense.paidBy)}</div>
                    <div className="expense-col amount">₹{expense.amount}</div>
                    <div className="expense-col category">
                      <span className="category-tag">{expense.category || 'Other'}</span>
                    </div>
                    <div className="expense-col date">
                      {new Date(expense.createdAt).toLocaleDateString()}
                    </div>
                    <div className="expense-col actions">
                      <button
                        className="btn btn-secondary btn-small"
                        onClick={() => handleEdit(expense)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-danger btn-small"
                        onClick={() => handleDelete(expense.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};