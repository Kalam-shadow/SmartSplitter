import React from 'react';
import { MembersPanel } from '../components/MembersPanel';
import { ExpenseForm } from '../components/ExpenseForm';
import { ExpenseList } from '../components/ExpenseList';
import { SummarySection } from '../components/SummarySection';
import { SettlementsSection } from '../components/SettlementsSection';
import { InsightsPanel } from '../components/InsightsPanel';
import '../styles/dashboard.css';

export const Dashboard = () => {
  return (
    <div className="dashboard">
      {/* Top Section: 3 Columns */}
      <div className="dashboard-top">
        <MembersPanel />
        <ExpenseForm />
        <ExpenseList />
      </div>

      {/* Middle Section: 2 Columns (Summary + Settlements) */}
      <div className="dashboard-middle">
        <SummarySection />
        <SettlementsSection />
      </div>

      {/* Bottom Section: Full Width */}
      <div className="dashboard-bottom">
        <InsightsPanel />
      </div>
    </div>
  );
};
