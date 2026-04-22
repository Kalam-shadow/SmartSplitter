import React from 'react';
import { useExpenseContext } from '../context/ExpenseContext';
import '../styles/components.css';

export const GroupSelector = () => {
  const { groups, currentGroup, switchGroup, deleteGroup } = useExpenseContext();

  if (groups.length === 0) {
    return null;
  }

  return (
    <div className="group-selector">
      <label htmlFor="groupSelector" className="group-label">
        Selected Group
      </label>
      <div className="group-controls">
        <select
          id="groupSelector"
          className="group-select"
          value={currentGroup?.id || ''}
          onChange={(e) => switchGroup(e.target.value)}
        >
          <option value="">Select a group</option>
          {groups.map((group) => (
            <option key={group.id} value={group.id}>
              {group.name}
            </option>
          ))}
        </select>
        {currentGroup && (
          <button
            className="btn btn-danger btn-sm"
            onClick={() => {
              if (window.confirm(`Delete "${currentGroup.name}"?`)) {
                deleteGroup(currentGroup.id);
              }
            }}
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
};
