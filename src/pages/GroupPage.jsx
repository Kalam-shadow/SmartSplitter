import React from 'react';
import { useExpenseContext } from '../context/ExpenseContext';
import { GroupForm } from '../components/GroupForm';
import { MemberList } from '../components/MemberList';
import { GroupSelector } from '../components/GroupSelector';
import '../styles/pages.css';

export const GroupPage = ({ onNavigate }) => {
  const { currentGroup } = useExpenseContext();

  return (
    <div className="page">
      <h1>Group Management</h1>

      {/* Create New Group */}
      <div className="section">
        <h2>Create New Group</h2>
        <GroupForm />
      </div>

      {/* Select Existing Group */}
      <div className="section">
        <h2>Switch Group</h2>
        <GroupSelector />
      </div>

      {/* Manage Members */}
      {currentGroup && (
        <div className="section">
          <h2>Manage Members</h2>
          <p className="group-name">Current Group: <strong>{currentGroup.name}</strong></p>
          <MemberList />

          <button
            className="btn btn-primary btn-lg"
            onClick={() => onNavigate('expenses')}
            disabled={currentGroup.members.length === 0}
          >
            Add Expenses →
          </button>
        </div>
      )}
    </div>
  );
};
