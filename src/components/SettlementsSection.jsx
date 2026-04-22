import React, { useMemo } from 'react';
import { useExpenseContext } from '../context/ExpenseContext';
import { calculateBalances } from '../utils/balanceCalculator';
import { simplifyDebts } from '../utils/debtSimplifier';
import '../styles/sections.css';

export const SettlementsSection = () => {
  const { currentGroup } = useExpenseContext();

  const balances = useMemo(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    if (!currentGroup) return {};
    return calculateBalances(currentGroup.expenses, currentGroup.members);
  }, [currentGroup]);

  const settlements = useMemo(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    if (!currentGroup) return [];
    return simplifyDebts(balances);
  }, [balances, currentGroup]);

  if (!currentGroup) {
    return (
      <section className="dashboard-section settlements-section">
        <div className="section-content">
          <p className="empty-placeholder">Select a group to view settlements</p>
        </div>
      </section>
    );
  }

  return (
    <section className="dashboard-section settlements-section">
      <div className="section-content">
        <h3>Who Pays Whom</h3>

        {settlements.length === 0 ? (
          <div className="empty-placeholder">
            {currentGroup.expenses.length > 0 ? 'All settled! ✓' : 'No expenses yet'}
          </div>
        ) : (
          <div className="settlement-list">
            {settlements.map((settlement, index) => (
              <div key={index} className="settlement-row">
                <div className="settlement-from">{settlement.from}</div>
                <div className="settlement-arrow">→</div>
                <div className="settlement-to">{settlement.to}</div>
                <div className="settlement-amount">₹{settlement.amount.toFixed(0)}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
