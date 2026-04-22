import React from 'react';
import '../styles/components.css';

export const CategoryChart = ({ spendingBreakdown }) => {
  const categories = Object.entries(spendingBreakdown);
  if (categories.length === 0) return null;

  const maxAmount = Math.max(...categories.map(([, amount]) => amount));

  return (
    <div className="category-chart">
      <h4>Category Spending</h4>
      <div className="chart-bars">
        {categories.map(([category, amount]) => (
          <div key={category} className="chart-bar">
            <div className="bar-label">{category}</div>
            <div className="bar-container">
              <div
                className="bar-fill"
                style={{ width: `${(amount / maxAmount) * 100}%` }}
              ></div>
            </div>
            <div className="bar-value">₹{amount.toFixed(0)}</div>
          </div>
        ))}
      </div>
    </div>
  );
};