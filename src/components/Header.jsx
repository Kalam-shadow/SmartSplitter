import React from 'react';
import { GroupForm } from './GroupForm';
import { GroupSelector } from './GroupSelector';
import '../styles/components.css';

export const Header = () => {
  return (
    <header className="dashboard-header">
      <div className="header-content" >
        <h1 className="app-title">SplitWise</h1>
      </div>
      <div className="header-actions">
        <div className="group-management" style={{ display: 'flex', gap: '10px' }}>
          <GroupSelector />
          <GroupForm />
        </div>
      </div>
    </header >
  );
};