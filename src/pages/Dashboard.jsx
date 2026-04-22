import React from 'react';
import { MembersPanel } from '../components/MembersPanel';
import { ExpenseForm } from '../components/ExpenseForm';
import { ExpenseList } from '../components/ExpenseList';
import { SummarySection } from '../components/SummarySection';
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

      {/* Bottom Section: 2 Columns */}
      <div className="dashboard-bottom">
        <SummarySection />
        <InsightsPanel />
      </div>
    </div>
  );
};
