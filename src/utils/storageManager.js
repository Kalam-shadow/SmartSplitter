const STORAGE_KEYS = {
  GROUPS: 'splitwise_groups',
  CURRENT_GROUP: 'splitwise_current_group',
};

/**
 * Load all groups from localStorage
 */
export const loadGroups = () => {
  try {
    const groups = localStorage.getItem(STORAGE_KEYS.GROUPS);
    return groups ? JSON.parse(groups) : [];
  } catch (error) {
    console.error('Error loading groups:', error);
    return [];
  }
};

/**
 * Save groups to localStorage
 */
export const saveGroups = (groups) => {
  try {
    localStorage.setItem(STORAGE_KEYS.GROUPS, JSON.stringify(groups));
  } catch (error) {
    console.error('Error saving groups:', error);
  }
};

/**
 * Load current group ID
 */
export const loadCurrentGroupId = () => {
  try {
    return localStorage.getItem(STORAGE_KEYS.CURRENT_GROUP);
  } catch (error) {
    console.error('Error loading current group:', error);
    return null;
  }
};

/**
 * Save current group ID
 */
export const saveCurrentGroupId = (groupId) => {
  try {
    localStorage.setItem(STORAGE_KEYS.CURRENT_GROUP, groupId);
  } catch (error) {
    console.error('Error saving current group:', error);
  }
};

/**
 * Clear all data
 */
export const clearAllData = () => {
  try {
    localStorage.removeItem(STORAGE_KEYS.GROUPS);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_GROUP);
  } catch (error) {
    console.error('Error clearing data:', error);
  }
};
