import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Avatar,
  Alert,
  InputAdornment,
  IconButton,
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import FormField from '../../components/forms/FormField';
import useAuth from '../../hooks/useAuth';
import authService from '../auth/authService';

export const Profile = () => {
  const { user, updateCurrentUser } = useAuth();

  // Profile info state
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    role: user?.role || 'user',
  });
  const [profileErrors, setProfileErrors] = useState({});
  const [updatingProfile, setUpdatingProfile] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileError, setProfileError] = useState('');

  // Password state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState({});
  const [updatingPassword, setUpdatingPassword] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        role: user.role || 'user',
      });
    }
  }, [user]);

  const getInitials = (name) => {
    if (!name) return 'JD';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
    if (profileErrors[name]) setProfileErrors((prev) => ({ ...prev, [name]: '' }));
    if (profileError) setProfileError('');
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    const errors = {};
    if (!profileData.name.trim()) errors.name = 'Full name is required';
    if (!profileData.email.trim()) errors.email = 'Email address is required';

    if (Object.keys(errors).length > 0) {
      setProfileErrors(errors);
      return;
    }

    try {
      setUpdatingProfile(true);
      setProfileError('');
      setProfileSuccess('');
      const res = await authService.updateProfile({
        name: profileData.name,
        email: profileData.email,
      });

      if (res.user) {
        updateCurrentUser(res.user);
      }
      setProfileSuccess('Profile updated successfully!');
      setTimeout(() => setProfileSuccess(''), 3000);
    } catch (err) {
      setProfileError(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setUpdatingProfile(false);
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
    if (passwordErrors[name]) setPasswordErrors((prev) => ({ ...prev, [name]: '' }));
    if (passwordError) setPasswordError('');
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    const errors = {};
    if (!passwordData.currentPassword) errors.currentPassword = 'Current password is required';
    if (!passwordData.newPassword) errors.newPassword = 'New password is required';
    else if (passwordData.newPassword.length < 6) errors.newPassword = 'Must be at least 6 characters';
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(errors).length > 0) {
      setPasswordErrors(errors);
      return;
    }

    try {
      setUpdatingPassword(true);
      setPasswordError('');
      setPasswordSuccess('');
      await authService.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      setPasswordSuccess('Password changed successfully!');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => setPasswordSuccess(''), 3000);
    } catch (err) {
      setPasswordError(err.response?.data?.message || 'Failed to change password.');
    } finally {
      setUpdatingPassword(false);
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      {/* Page Header */}
      <Box sx={{ mb: 3.5 }}>
        <Typography variant="h5" fontWeight={800} color="#0f172a" sx={{ fontSize: '1.65rem' }}>
          My Profile
        </Typography>
        <Typography variant="body2" color="#64748b" sx={{ mt: 0.5, fontSize: '0.9rem' }}>
          Manage your account information.
        </Typography>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            md: '1fr 1fr',
          },
          gap: 3,
          width: '100%',
        }}
      >
        {/* Left Card: Account Info */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2.5, sm: 4 },
            borderRadius: 3.5,
            border: '1px solid #e2e8f0',
            bgcolor: '#ffffff',
            boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Typography variant="h6" fontWeight={800} color="#0f172a" sx={{ mb: 3 }}>
            Account Info
          </Typography>

          {profileError && (
            <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
              {profileError}
            </Alert>
          )}

          {profileSuccess && (
            <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }}>
              {profileSuccess}
            </Alert>
          )}

          {/* Large Avatar */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3.5 }}>
            <Avatar
              sx={{
                width: 72,
                height: 72,
                bgcolor: '#0f172a',
                color: '#ffffff',
                fontSize: '1.6rem',
                fontWeight: 800,
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              }}
            >
              {getInitials(profileData.name)}
            </Avatar>
          </Box>

          <Box component="form" onSubmit={handleProfileSubmit} noValidate sx={{ flexGrow: 1 }}>
            <FormField label="Full Name" required error={profileErrors.name}>
              <Input
                name="name"
                value={profileData.name}
                onChange={handleProfileChange}
                error={Boolean(profileErrors.name)}
                size="small"
              />
            </FormField>

            <FormField label="Email" required error={profileErrors.email}>
              <Input
                name="email"
                type="email"
                value={profileData.email}
                onChange={handleProfileChange}
                error={Boolean(profileErrors.email)}
                size="small"
              />
            </FormField>

            <FormField label="Role">
              <Input
                name="role"
                value={profileData.role === 'admin' ? 'Admin' : 'User'}
                disabled
                size="small"
                sx={{ bgcolor: '#f8fafc' }}
              />
            </FormField>

            <Button
              type="submit"
              variant="contained"
              loading={updatingProfile}
              sx={{
                mt: 2,
                py: 1.1,
                px: 3,
                bgcolor: '#1d68f6',
                '&:hover': { bgcolor: '#1a5bd8' },
                borderRadius: 2.5,
                fontWeight: 700,
              }}
            >
              Update Profile
            </Button>
          </Box>
        </Paper>

        {/* Right Card: Change Password */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2.5, sm: 4 },
            borderRadius: 3.5,
            border: '1px solid #e2e8f0',
            bgcolor: '#ffffff',
            boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" fontWeight={800} color="#0f172a">
              Change Password
            </Typography>
            <Typography variant="body2" color="#64748b" sx={{ mt: 0.5 }}>
              Update your password for better security.
            </Typography>
          </Box>

          {passwordError && (
            <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
              {passwordError}
            </Alert>
          )}

          {passwordSuccess && (
            <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }}>
              {passwordSuccess}
            </Alert>
          )}

          <Box component="form" onSubmit={handlePasswordSubmit} noValidate sx={{ flexGrow: 1 }}>
            <FormField label="Current Password" required error={passwordErrors.currentPassword}>
              <Input
                name="currentPassword"
                type={showCurrent ? 'text' : 'password'}
                placeholder="Enter current password"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                error={Boolean(passwordErrors.currentPassword)}
                size="small"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        size="small"
                        onClick={() => setShowCurrent(!showCurrent)}
                        edge="end"
                      >
                        {showCurrent ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </FormField>

            <FormField label="New Password" required error={passwordErrors.newPassword}>
              <Input
                name="newPassword"
                type={showNew ? 'text' : 'password'}
                placeholder="Enter new password"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                error={Boolean(passwordErrors.newPassword)}
                size="small"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        size="small"
                        onClick={() => setShowNew(!showNew)}
                        edge="end"
                      >
                        {showNew ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </FormField>

            <FormField label="Confirm Password" required error={passwordErrors.confirmPassword}>
              <Input
                name="confirmPassword"
                type={showConfirm ? 'text' : 'password'}
                placeholder="Confirm new password"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                error={Boolean(passwordErrors.confirmPassword)}
                size="small"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        size="small"
                        onClick={() => setShowConfirm(!showConfirm)}
                        edge="end"
                      >
                        {showConfirm ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </FormField>

            <Button
              type="submit"
              variant="contained"
              loading={updatingPassword}
              sx={{
                mt: 2,
                py: 1.1,
                px: 3,
                bgcolor: '#1d68f6',
                '&:hover': { bgcolor: '#1a5bd8' },
                borderRadius: 2.5,
                fontWeight: 700,
              }}
            >
              Change Password
            </Button>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default Profile;
