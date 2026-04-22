import React, { useMemo, useState } from 'react';
import { useExpenseContext } from '../context/ExpenseContext';
import { calculateBalances, calculateTotalSpent } from '../utils/balanceCalculator';
import { simplifyDebts, getSpendingBreakdown } from '../utils/debtSimplifier';
import { generateInsights } from '../utils/aiInsights';
import '../styles/sections.css';

export const InsightsPanel = () => {
  const { currentGroup } = useExpenseContext();
  const [loadingInsights, setLoadingInsights] = useState(false);
  const [aiInsights, setAiInsights] = useState([]);

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

  const memberBalances = Object.entries(balances).map(([memberId, balance]) => {
    const member = currentGroup?.members.find(m => m.id === memberId);
    return {
      name: member?.name || 'Unknown',
      balance: balance.net
    };
  }).sort((a, b) => b.balance - a.balance);

  const topSpender = memberBalances[0];
  const mostOwed = memberBalances[memberBalances.length - 1];

  const handleGenerateInsights = async () => {
    if (!currentGroup) return;
    setLoadingInsights(true);
    setAiInsights([]);
    try {
      const data = {
        total: totalSpent,
        topSpender: topSpender ? `${topSpender.name} (₹${topSpender.balance.toFixed(0)})` : 'None',
        categories: spendingBreakdown,
        transactions: currentGroup.expenses.length
      };
      const result = await generateInsights(data);
      // Split by newline and filter out empty strings
      const lines = result.split('\n').filter(line => line.trim().length > 0);
      setAiInsights(lines);
    } catch (error) {
      console.error(error);
      setAiInsights(["Failed to generate insights."]);
    } finally {
      setLoadingInsights(false);
    }
  };

  if (!currentGroup) {
    return (
      <section className="dashboard-section insights-section">
        <div className="section-content">
          <h3>Insights</h3>
          <div className="empty-placeholder">
            <p>Select a group to view insights</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="dashboard-section insights-section">
      <div className="section-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3>Insights & Suggestions</h3>
          <button 
            className="btn btn-primary btn-sm" 
            onClick={handleGenerateInsights}
            disabled={loadingInsights || currentGroup.expenses.length === 0}
          >
            {loadingInsights ? 'Generating...' : 'Generate AI Insights'}
          </button>
        </div>

        {aiInsights.length > 0 && (
          <div className="insight-card ai-insights-card" style={{ marginBottom: '0.8rem', borderLeft: '3px solid #d4af37' }}>
            <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span role="img" aria-label="sparkles">✨</span> AI Insights
            </h4>
            <ul style={{ paddingLeft: '1.2rem', margin: '0.5rem 0', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              {aiInsights.map((insight, idx) => (
                <li key={idx} style={{ marginBottom: '0.3rem' }}>{insight.replace(/^[*-\s]+/, '')}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="insights-grid">
          {/* Quick Stats */}
          <div className="insight-card">
            <h4>Quick Stats</h4>
            <div className="insight-item">
              <span>Total Expenses:</span>
              <strong>{currentGroup.expenses.length}</strong>
            </div>
            <div className="insight-item">
              <span>Average per Expense:</span>
              <strong>₹{(totalSpent / Math.max(currentGroup.expenses.length, 1)).toFixed(2)}</strong>
            </div>
            <div className="insight-item">
              <span>Settlements Needed:</span>
              <strong>{settlements.length}</strong>
            </div>
          </div>

          {/* Top Contributors */}
          <div className="insight-card">
            <h4>Top Contributors</h4>
            {topSpender && (
              <div className="insight-item">
                <span>Highest Balance:</span>
                <strong>{topSpender.name} (₹{topSpender.balance.toFixed(2)})</strong>
              </div>
            )}
            {mostOwed && mostOwed.balance < 0 && (
              <div className="insight-item">
                <span>Most Owed:</span>
                <strong>{mostOwed.name} (₹{Math.abs(mostOwed.balance).toFixed(2)})</strong>
              </div>
            )}
          </div>

          {/* Suggestions */}
          <div className="insight-card">
            <h4>Suggestions</h4>
            {settlements.length === 0 ? (
              <p className="insight-suggestion">All settled up! 🎉</p>
            ) : (
              <div className="settlement-suggestions">
                {settlements.slice(0, 3).map((settlement, index) => (
                  <p key={index} className="insight-suggestion">
                    {settlement.from} → {settlement.to}: ₹{settlement.amount.toFixed(2)}
                  </p>
                ))}
                {settlements.length > 3 && (
                  <p className="insight-suggestion">... and {settlements.length - 3} more settlements</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};