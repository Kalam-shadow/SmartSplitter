import React, { useState } from 'react';
import { useExpenseContext } from '../context/ExpenseContext';
import { categorizeExpense } from '../utils/balanceCalculator';
import '../styles/components.css';

export const ExpenseForm = ({ onExpenseAdded }) => {
  const { currentGroup, addExpense } = useExpenseContext();
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    paidBy: '',
    participants: [],
    splitType: 'equal',
  });
  const [customAmounts, setCustomAmounts] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleParticipantChange = (memberId) => {
    setFormData((prev) => {
      const participants = prev.participants.includes(memberId)
        ? prev.participants.filter((p) => p !== memberId)
        : [...prev.participants, memberId];

      return {
        ...prev,
        participants,
      };
    });
  };

  const handleCustomAmountChange = (memberId, value) => {
    setCustomAmounts((prev) => ({
      ...prev,
      [memberId]: parseFloat(value) || 0,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.description.trim() ||
      !formData.amount ||
      !formData.paidBy ||
      formData.participants.length === 0
    ) {
      alert('Please fill all required fields');
      return;
    }

    if (formData.splitType === 'custom') {
      const totalCustom = formData.participants.reduce(
        (sum, pId) => sum + (customAmounts[pId] || 0),
        0
      );
      if (Math.abs(totalCustom - parseFloat(formData.amount)) > 0.01) {
        alert('Custom split amounts must equal the total expense amount');
        return;
      }
    }

    const expense = {
      description: formData.description,
      amount: parseFloat(formData.amount),
      paidBy: formData.paidBy,
      participants: formData.participants,
      splitType: formData.splitType,
      customAmounts: formData.splitType === 'custom' ? customAmounts : {},
      category: categorizeExpense(formData.description),
    };

    addExpense(expense);
    setFormData({
      description: '',
      amount: '',
      paidBy: '',
      participants: [],
      splitType: 'equal',
    });
    setCustomAmounts({});

    if (onExpenseAdded) onExpenseAdded();
  };

  if (!currentGroup || currentGroup.members.length === 0) {
    return (
      <div className="empty-state">
        Create a group and add members before adding expenses
      </div>
    );
  }

  const equalSplitAmount = formData.amount
    ? (parseFloat(formData.amount) / formData.participants.length).toFixed(2)
    : 0;

  return (
    <form onSubmit={handleSubmit} className="form">
      <div className="form-group">
        <label htmlFor="description">Description</label>
        <input
          id="description"
          type="text"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          placeholder="e.g., Lunch, Gas, Hotel"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="amount">Amount (₹)</label>
        <input
          id="amount"
          type="number"
          name="amount"
          value={formData.amount}
          onChange={handleInputChange}
          placeholder="0.00"
          step="0.01"
          min="0"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="paidBy">Paid By</label>
        <select
          id="paidBy"
          name="paidBy"
          value={formData.paidBy}
          onChange={handleInputChange}
          required
        >
          <option value="">Select member</option>
          {currentGroup.members.map((member) => (
            <option key={member.id} value={member.id}>
              {member.name}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>Split Type</label>
        <div className="radio-group">
          <label>
            <input
              type="radio"
              name="splitType"
              value="equal"
              checked={formData.splitType === 'equal'}
              onChange={handleInputChange}
            />
            Equal Split
          </label>
          <label>
            <input
              type="radio"
              name="splitType"
              value="custom"
              checked={formData.splitType === 'custom'}
              onChange={handleInputChange}
            />
            Custom Split
          </label>
        </div>
      </div>

      <div className="form-group">
        <label>Participants</label>
        <div className="checkbox-group">
          {currentGroup.members.map((member) => (
            <div key={member.id} className="checkbox-item">
              <input
                type="checkbox"
                id={`participant-${member.id}`}
                checked={formData.participants.includes(member.id)}
                onChange={() => handleParticipantChange(member.id)}
              />
              <label htmlFor={`participant-${member.id}`}>{member.name}</label>
              {formData.splitType === 'custom' &&
                formData.participants.includes(member.id) && (
                  <input
                    type="number"
                    value={customAmounts[member.id] || ''}
                    onChange={(e) =>
                      handleCustomAmountChange(member.id, e.target.value)
                    }
                    placeholder="Amount"
                    step="0.01"
                    min="0"
                    className="custom-amount-input"
                  />
                )}
              {formData.splitType === 'equal' &&
                formData.participants.includes(member.id) && (
                  <span className="split-amount">₹{equalSplitAmount}</span>
                )}
            </div>
          ))}
        </div>
      </div>

      <button type="submit" className="btn btn-primary">
        Add Expense
      </button>
    </form>
  );
};
