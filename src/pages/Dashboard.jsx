import React from 'react';
import { GroupSection } from '../components/GroupSection';
import { ExpenseSection } from '../components/ExpenseSection';
import { SummarySection } from '../components/SummarySection';
import '../styles/dashboard.css';

export const Dashboard = () => {
  return (
    <div className="dashboard">
      {/* Top Section: 2 Columns */}
      <div className="dashboard-top">
        <GroupSection />
        <ExpenseSection />
      </div>

      {/* Bottom Section: Full Width Summary */}
      <div className="dashboard-bottom">
        <SummarySection />
      </div>
    </div>
  );
};
