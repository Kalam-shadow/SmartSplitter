import React, { useMemo } from 'react';
import { calculateBalances, calculateTotalSpent } from '../utils/balanceCalculator';
import { simplifyDebts } from '../utils/debtSimplifier';
import '../styles/components.css';

export const BalanceList = ({ expenses, members }) => {
  const balances = useMemo(() => calculateBalances(expenses, members), [expenses, members]);
  const totalSpent = useMemo(() => calculateTotalSpent(expenses), [expenses]);
  const settlements = useMemo(() => simplifyDebts(balances), [balances]);

  return (
    <div className="balance-container">
      {/* Total Spent */}
      <div className="card">
        <h3>Total Spent</h3>
        <div className="total-amount">₹{totalSpent.toFixed(2)}</div>
      </div>

      {/* Individual Balances */}
      <div className="card">
        <h3>Individual Balances</h3>
        {Object.entries(balances).length === 0 ? (
          <p className="empty-state">No members</p>
        ) : (
          <div className="balance-items">
            {Object.entries(balances).map(([memberId, balance]) => (
              <div key={memberId} className="balance-item">
                <div className="balance-name-paid">
                  <span className="member-name">{balance.name}</span>
                  <span className="paid-amount">
                    Paid: ₹{balance.paid.toFixed(2)}
                  </span>
                </div>
                <div className="balance-owes-net">
                  <span className="owes-amount">
                    Owes: ₹{balance.owes.toFixed(2)}
                  </span>
                  <span
                    className={`net-balance ${
                      balance.net > 0.01 ? 'positive' : balance.net < -0.01 ? 'negative' : ''
                    }`}
                  >
                    {balance.net > 0.01
                      ? `+₹${balance.net.toFixed(2)}`
                      : `₹${balance.net.toFixed(2)}`}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Settlements */}
      <div className="card">
        <h3>Settlements</h3>
        {settlements.length === 0 ? (
          <p className="empty-state">All settled!</p>
        ) : (
          <div className="settlement-items">
            {settlements.map((settlement, index) => (
              <div key={index} className="settlement-item">
                <div className="settlement-flow">
                  <span className="from-person">{settlement.from}</span>
                  <span className="arrow">→</span>
                  <span className="to-person">{settlement.to}</span>
                </div>
                <span className="settlement-amount">
                  ₹{settlement.amount.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
