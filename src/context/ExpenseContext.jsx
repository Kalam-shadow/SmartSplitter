import React, { createContext, useState, useEffect } from 'react';
import { loadGroups, saveGroups, loadCurrentGroupId, saveCurrentGroupId } from '../utils/storageManager';

export const ExpenseContext = createContext();

export const ExpenseProvider = ({ children }) => {
  const [groups, setGroups] = useState([]);
  const [currentGroupId, setCurrentGroupId] = useState(null);
  const [editingExpense, setEditingExpense] = useState(null);
  const [toast, setToast] = useState(null);

  // Load data on mount
  useEffect(() => {
    const loadedGroups = loadGroups();
    setGroups(loadedGroups);

    const savedGroupId = loadCurrentGroupId();
    if (savedGroupId && loadedGroups.some((g) => g.id === savedGroupId)) {
      setCurrentGroupId(savedGroupId);
    }
  }, []);

  // Save groups to localStorage whenever they change
  useEffect(() => {
    saveGroups(groups);
  }, [groups]);

  // Clear editing expense when switching groups
  useEffect(() => {
    setEditingExpense(null);
  }, [currentGroupId]);

  // Save current group ID whenever it changes
  useEffect(() => {
    if (currentGroupId) {
      saveCurrentGroupId(currentGroupId);
    }
  }, [currentGroupId]);

  const currentGroup = groups.find((g) => g.id === currentGroupId) || null;


  const startEditing = (expense) => {
    setEditingExpense(expense);
  };

  const cancelEditing = () => {
    setEditingExpense(null);
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => setToast(null), 3000);
  };

  // Create a new group
  const createGroup = (groupName) => {
    const newGroup = {
      id: Date.now().toString(),
      name: groupName,
      members: [],
      expenses: [],
      createdAt: new Date().toISOString(),
    };
    setGroups([...groups, newGroup]);
    setCurrentGroupId(newGroup.id);
    return newGroup;
  };

  // Delete a group
  const deleteGroup = (groupId) => {
    setGroups(groups.filter((g) => g.id !== groupId));
    if (currentGroupId === groupId) {
      const remaining = groups.filter((g) => g.id !== groupId);
      setCurrentGroupId(remaining.length > 0 ? remaining[0].id : null);
    }
  };

  // Add member to current group
  const addMember = (memberName) => {
    if (!currentGroup) return;

    const newMember = {
      id: Date.now().toString(),
      name: memberName,
    };

    const updatedGroups = groups.map((g) => {
      if (g.id === currentGroupId) {
        return {
          ...g,
          members: [...g.members, newMember],
        };
      }
      return g;
    });

    setGroups(updatedGroups);
  };

  // Remove member from current group
  const removeMember = (memberId) => {
    if (!currentGroup) return;

    const updatedGroups = groups.map((g) => {
      if (g.id === currentGroupId) {
        return {
          ...g,
          members: g.members.filter((m) => m.id !== memberId),
          // Also remove this member from all expenses
          expenses: g.expenses.map((exp) => ({
            ...exp,
            participants: exp.participants.filter((p) => p !== memberId),
          })),
        };
      }
      return g;
    });

    setGroups(updatedGroups);
  };

  // Add expense to current group
  const addExpense = (expense) => {
    if (!currentGroup) return;

    const newExpense = {
      id: Date.now().toString(),
      ...expense,
      createdAt: new Date().toISOString(),
    };

    const updatedGroups = groups.map((g) => {
      if (g.id === currentGroupId) {
        return {
          ...g,
          expenses: [...g.expenses, newExpense],
        };
      }
      return g;
    });

    setGroups(updatedGroups);
    showToast('Expense added ✓');
  };

  // Update an existing expense in current group
  const updateExpense = (updatedExpense) => {
    if (!currentGroup) return;

    const updatedGroups = groups.map((g) => {
      if (g.id === currentGroupId) {
        return {
          ...g,
          expenses: g.expenses.map((exp) =>
            exp.id === updatedExpense.id
              ? { ...updatedExpense, updatedAt: new Date().toISOString() }
              : exp
          ),
        };
      }
      return g;
    });

    setGroups(updatedGroups);
    showToast('Expense updated ✓');
  };

  // Delete expense from current group
  const deleteExpense = (expenseId) => {
    if (!currentGroup) return;

    const updatedGroups = groups.map((g) => {
      if (g.id === currentGroupId) {
        return {
          ...g,
          expenses: g.expenses.filter((e) => e.id !== expenseId),
        };
      }
      return g;
    });

    setGroups(updatedGroups);
    showToast('Expense deleted ✓');
  };

  // Switch to different group
  const switchGroup = (groupId) => {
    if (groups.some((g) => g.id === groupId)) {
      setCurrentGroupId(groupId);
    }
  };

  const value = {
    groups,
    currentGroup,
    currentGroupId,

    createGroup,
    deleteGroup,
    addMember,
    removeMember,

    updateExpense,
    addExpense,
    deleteExpense,

    editingExpense,
    startEditing,
    cancelEditing,

    switchGroup,
    toast,
    showToast,
  };

  return <ExpenseContext.Provider value={value}>{children}</ExpenseContext.Provider>;
};

// Custom hook to use the context
export const useExpenseContext = () => {
  const context = React.useContext(ExpenseContext);
  if (!context) {
    throw new Error('useExpenseContext must be used within ExpenseProvider');
  }
  return context;
};
