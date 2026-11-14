export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const STATUS = {
  PENDING: 'Pending',
  IN_PROGRESS: 'In Progress',
  RESOLVED: 'Resolved',
};

export const STATUS_OPTIONS = [
  STATUS.PENDING,
  STATUS.IN_PROGRESS,
  STATUS.RESOLVED,
];

export const STATUS_COLORS = {
  [STATUS.PENDING]: 'warning',
  [STATUS.IN_PROGRESS]: 'info',
  [STATUS.RESOLVED]: 'success',
};

export const ROLES = {
  ADMIN: 'admin',
  USER: 'user',
};

export const DEFAULT_PAGE_SIZE = 5;

