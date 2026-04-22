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
    <form onSubmit={handleSubmit} className="group-form">
      <label htmlFor="groupName" className="group-label">
        Create Group
      </label>
      <div className="group-controls">
        <input
          id="groupName"
          type="text"
          className="group-input"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          placeholder="Enter group name"
          required
        />
        <button type="submit" className="btn btn-primary">
          Create
        </button>
      </div>
    </form>
  );
};
