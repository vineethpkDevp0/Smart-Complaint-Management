import { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Paper,
  Chip,
  IconButton,
  Tooltip,
  TextField,
  InputAdornment,
  Alert,
  Pagination,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import ReusableTable from '../../components/table/ReusableTable';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import FormField from '../../components/forms/FormField';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import authService from '../auth/authService';
import useDebounce from '../../hooks/useDebounce';
import { ROLES } from '../../utils/constants';

export const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Dialog states
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: ROLES.USER,
    status: 'Active',
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Delete state
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const debouncedSearch = useDebounce(search, 350);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const res = await authService.getUsers(debouncedSearch);
      setUsers(res.users || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch users.');
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleOpenAdd = () => {
    setEditingUser(null);
    setFormData({
      name: '',
      email: '',
      password: '',
      role: ROLES.USER,
      status: 'Active',
    });
    setFormErrors({});
    setModalOpen(true);
  };

  const handleOpenEdit = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name || '',
      email: user.email || '',
      password: '',
      role: user.role || ROLES.USER,
      status: user.status || 'Active',
    });
    setFormErrors({});
    setModalOpen(true);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSaveUser = async (e) => {
    e.preventDefault();
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Name is required';
    if (!formData.email.trim()) errors.email = 'Email is required';
    if (!editingUser && !formData.password) errors.password = 'Password is required';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      setSubmitting(true);
      if (editingUser) {
        await authService.updateUser(editingUser._id, formData);
        setSuccess('User updated successfully!');
      } else {
        await authService.createUser(formData);
        setSuccess('User created successfully!');
      }
      setModalOpen(false);
      fetchUsers();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save user.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      setDeleting(true);
      await authService.deleteUser(deleteTarget._id);
      setDeleteTarget(null);
      fetchUsers();
      setSuccess('User deleted successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete user.');
    } finally {
      setDeleting(false);
    }
  };

  const columns = [
    {
      id: 'name',
      label: 'Name',
      minWidth: 160,
      render: (value) => (
        <Typography variant="body2" fontWeight={700} color="#0f172a">
          {value}
        </Typography>
      ),
    },
    {
      id: 'email',
      label: 'Email',
      minWidth: 200,
      render: (value) => (
        <Typography variant="body2" color="#64748b">
          {value}
        </Typography>
      ),
    },
    {
      id: 'role',
      label: 'Role',
      minWidth: 100,
      render: (value) => {
        const isAdmin = value === 'admin';
        return (
          <Chip
            label={isAdmin ? 'Admin' : 'User'}
            size="small"
            sx={{
              bgcolor: isAdmin ? '#f3e8ff' : '#f0fdf4',
              color: isAdmin ? '#7e22ce' : '#15803d',
              fontWeight: 700,
              fontSize: '0.75rem',
              borderRadius: 1.5,
              height: 24,
              border: 'none',
            }}
          />
        );
      },
    },
    {
      id: 'status',
      label: 'Status',
      minWidth: 100,
      render: (value = 'Active') => {
        const isActive = value === 'Active';
        return (
          <Chip
            label={value}
            size="small"
            sx={{
              bgcolor: isActive ? '#dcfce7' : '#f1f5f9',
              color: isActive ? '#16a34a' : '#64748b',
              fontWeight: 700,
              fontSize: '0.75rem',
              borderRadius: 1.5,
              height: 24,
              border: 'none',
            }}
          />
        );
      },
    },
    {
      id: 'actions',
      label: 'Actions',
      align: 'right',
      minWidth: 110,
      render: (_, row) => (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 0.5 }}>
          <Tooltip title="Edit">
            <IconButton
              size="small"
              onClick={() => handleOpenEdit(row)}
              sx={{
                color: '#ef4444',
                bgcolor: '#fef2f2',
                p: 0.8,
                borderRadius: 1.5,
                '&:hover': { bgcolor: '#fee2e2' },
              }}
            >
              <EditOutlinedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton
              size="small"
              onClick={() => setDeleteTarget(row)}
              sx={{
                color: '#ef4444',
                bgcolor: '#fef2f2',
                p: 0.8,
                borderRadius: 1.5,
                '&:hover': { bgcolor: '#fee2e2' },
              }}
            >
              <DeleteOutlineOutlinedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  return (
    <Box>
      {/* Page Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" fontWeight={800} color="#0f172a">
          Users
        </Typography>
        <Typography variant="body2" color="#64748b" sx={{ mt: 0.5 }}>
          Manage system users
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2.5, borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2.5, borderRadius: 2 }}>
          {success}
        </Alert>
      )}

      {/* Main Table Card */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: 3.5,
          border: '1px solid #e2e8f0',
          p: { xs: 2, sm: 3 },
          bgcolor: '#ffffff',
        }}
      >
        {/* Toolbar */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 2,
            mb: 3,
          }}
        >
          <TextField
            size="small"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" sx={{ color: '#94a3b8' }} />
                </InputAdornment>
              ),
            }}
            sx={{
              width: { xs: '100%', sm: 280 },
              '& .MuiOutlinedInput-root': {
                borderRadius: 2.5,
                bgcolor: '#ffffff',
              },
            }}
          />

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenAdd}
            sx={{
              bgcolor: '#1d68f6',
              '&:hover': { bgcolor: '#1a5bd8' },
              borderRadius: 2.5,
              fontWeight: 700,
              px: 2.5,
              py: 1,
            }}
          >
            + Add User
          </Button>
        </Box>

        {/* Data Table */}
        <ReusableTable
          columns={columns}
          data={users}
          loading={loading}
          emptyMessage="No users found."
        />

        {/* Footer */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 2,
            mt: 3,
            pt: 2,
            borderTop: '1px solid #f1f5f9',
          }}
        >
          <Typography variant="body2" color="#64748b" fontWeight={500}>
            Showing 1-{users.length} of {users.length}
          </Typography>

          <Pagination
            count={1}
            page={1}
            shape="rounded"
            color="primary"
            sx={{
              '& .MuiPaginationItem-root': {
                borderRadius: 1.5,
                fontWeight: 600,
                fontSize: '0.85rem',
                '&.Mui-selected': {
                  bgcolor: '#1d68f6',
                  color: '#ffffff',
                },
              },
            }}
          />
        </Box>
      </Paper>

      {/* Add / Edit User Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingUser ? 'Edit User' : 'Add New User'}
        maxWidth="xs"
      >
        <Box component="form" onSubmit={handleSaveUser} noValidate sx={{ pt: 1 }}>
          <FormField label="Full Name" required error={formErrors.name}>
            <Input
              name="name"
              placeholder="e.g. John Doe"
              value={formData.name}
              onChange={handleFormChange}
              error={Boolean(formErrors.name)}
              size="small"
            />
          </FormField>

          <FormField label="Email Address" required error={formErrors.email}>
            <Input
              name="email"
              type="email"
              placeholder="name@example.com"
              value={formData.email}
              onChange={handleFormChange}
              error={Boolean(formErrors.email)}
              size="small"
            />
          </FormField>

          {!editingUser && (
            <FormField label="Password" required error={formErrors.password}>
              <Input
                name="password"
                type="password"
                placeholder="Password (min 6 characters)"
                value={formData.password}
                onChange={handleFormChange}
                error={Boolean(formErrors.password)}
                size="small"
              />
            </FormField>
          )}

          <FormField label="Role">
            <Select
              name="role"
              value={formData.role}
              onChange={handleFormChange}
              options={[
                { label: 'User', value: ROLES.USER },
                { label: 'Admin', value: ROLES.ADMIN },
              ]}
              size="small"
            />
          </FormField>

          <FormField label="Status">
            <Select
              name="status"
              value={formData.status}
              onChange={handleFormChange}
              options={[
                { label: 'Active', value: 'Active' },
                { label: 'Inactive', value: 'Inactive' },
              ]}
              size="small"
            />
          </FormField>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1.5, mt: 3 }}>
            <Button variant="outlined" color="inherit" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              loading={submitting}
              sx={{ bgcolor: '#1d68f6', '&:hover': { bgcolor: '#1a5bd8' } }}
            >
              {editingUser ? 'Save Changes' : 'Create User'}
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Delete User Confirmation Dialog */}
      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete User"
        message={`Are you sure you want to delete ${deleteTarget?.name}?`}
        confirmText="Delete"
        confirmColor="error"
        loading={deleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </Box>
  );
};

export default UserManagement;

