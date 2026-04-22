import React from 'react';
import { useExpenseContext } from '../context/ExpenseContext';
import { MemberList } from './MemberList';
import '../styles/sections.css';

export const MembersPanel = () => {
  const { currentGroup } = useExpenseContext();

  return (
    <section className="dashboard-section members-panel">
      <div className="section-content">
        <h3>Members</h3>

        {!currentGroup ? (
          <div className="empty-placeholder">
            <p>Create or select a group to manage members</p>
          </div>
        ) : (
          <MemberList />
        )}
      </div>
    </section>
  );
};