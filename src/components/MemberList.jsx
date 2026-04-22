import React, { useState } from 'react';
import { useExpenseContext } from '../context/ExpenseContext';
import '../styles/components.css';

export const MemberList = () => {
  const [memberName, setMemberName] = useState('');
  const { currentGroup, addMember, removeMember } = useExpenseContext();

  const handleAddMember = (e) => {
    e.preventDefault();
    if (memberName.trim() && currentGroup) {
      addMember(memberName);
      setMemberName('');
    }
  };

  if (!currentGroup) {
    return <div className="empty-state">No group selected</div>;
  }

  return (
    <div className="member-list-container">
      <h3>Members</h3>
      <form onSubmit={handleAddMember} className="form">
        <div className="form-group">
          <label htmlFor="memberName">Add Member</label>
          <div className="input-with-button">
            <input
              id="memberName"
              type="text"
              value={memberName}
              onChange={(e) => setMemberName(e.target.value)}
              placeholder="Enter member name"
            />
            <button type="submit" className="btn btn-secondary">
              Add
            </button>
          </div>
        </div>
      </form>

      {currentGroup.members.length === 0 ? (
        <div className="empty-placeholder">
          <p>Add members to start tracking expenses</p>
        </div>
      ) : (
        <div className="member-items">
          {currentGroup.members.map((member) => (
            <div key={member.id} className="member-item">
              <span>{member.name}</span>
              <button
                className="btn btn-danger btn-sm"
                onClick={() => removeMember(member.id)}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
