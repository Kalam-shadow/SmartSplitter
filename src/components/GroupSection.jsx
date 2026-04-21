import React from 'react';
import { useExpenseContext } from '../context/ExpenseContext';
import { GroupForm } from '../components/GroupForm';
import { GroupSelector } from '../components/GroupSelector';
import { MemberList } from '../components/MemberList';
import '../styles/sections.css';

export const GroupSection = () => {
  const { currentGroup } = useExpenseContext();

  return (
    <section className="dashboard-section group-section">
      <div className="section-content">
        {/* Create Group */}
        <div className="subsection">
          <h3>Create Group</h3>
          <GroupForm />
        </div>

        {/* Select Group */}
        <div className="subsection">
          <h3>Select Group</h3>
          <GroupSelector />
        </div>

        {/* Manage Members */}
        {currentGroup && (
          <div className="subsection">
            <h3>Members in {currentGroup.name}</h3>
            <MemberList />
          </div>
        )}

        {!currentGroup && (
          <div className="empty-placeholder">
            <p>Create or select a group to manage members</p>
          </div>
        )}
      </div>
    </section>
  );
};
