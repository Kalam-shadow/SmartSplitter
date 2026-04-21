import React, { useState } from 'react';
import { useExpenseContext } from '../context/ExpenseContext';
import '../styles/components.css';

export const GroupForm = ({ onGroupCreated }) => {
  const [groupName, setGroupName] = useState('');
  const { createGroup } = useExpenseContext();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (groupName.trim()) {
      createGroup(groupName);
      setGroupName('');
      if (onGroupCreated) onGroupCreated();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      <div className="form-group">
        <label htmlFor="groupName">Group Name</label>
        <input
          id="groupName"
          type="text"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          placeholder="Enter group name (e.g., Trip, Roommates)"
          required
        />
      </div>
      <button type="submit" className="btn btn-primary">
        Create Group
      </button>
    </form>
  );
};
