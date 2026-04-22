import React from 'react';
import { GroupForm } from './GroupForm';
import { GroupSelector } from './GroupSelector';
import '../styles/components.css';

export const Header = () => {
  return (
    <header className="dashboard-header">
      <div className="header-content">
        <h1 className="app-title">SplitWise</h1>
        <div className="header-actions">
          <GroupSelector />
          <GroupForm />
        </div>
      </div>
    </header>
  );
};