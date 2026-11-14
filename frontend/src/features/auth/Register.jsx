import { useState } from 'react';
import {
  Box,
  Typography,
  Alert,
  Link as MuiLink,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Button from '../../components/common/Button';
import FormField from '../../components/forms/FormField';
import Logo from '../../components/common/Logo';
import AuthHeroIllustration from '../../components/common/AuthHeroIllustration';
import useAuth from '../../hooks/useAuth';
import { validateRegisterForm } from '../../utils/validation';
import { ROLES } from '../../utils/constants';

export const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: ROLES.USER,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const roleOptions = [
    { label: 'User', value: ROLES.USER },
    { label: 'Admin', value: ROLES.ADMIN },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    if (serverError) setServerError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validation = validateRegisterForm(formData);
    const newErrors = { ...validation.errors };

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirm password is required';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);
      setServerError('');
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      });
      setSuccessMessage('Registration successful! Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 1200);
    } catch (err) {
      const msg =
        err.response?.data?.message || 'Registration failed. Please try again.';
      setServerError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: '#f1f5f9',
        p: { xs: 2, md: 4 },
      }}
    >
      <Box
        sx={{
          maxWidth: 960,
          width: '100%',
          bgcolor: '#ffffff',
          borderRadius: 4,
          boxShadow: '0 10px 40px rgba(0,0,0,0.06)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          border: '1px solid #e2e8f0',
        }}
      >
        {/* Left Hero Panel */}
        <Box
          sx={{
            flex: 1.1,
            background: 'linear-gradient(145deg, #e0f2fe 0%, #dbeafe 60%, #eff6ff 100%)',
            p: { xs: 4, sm: 6 },
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            alignItems: 'center',
            textAlign: 'center',
          }}
        >
          <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Logo size={42} showTagline sx={{ mb: 2 }} />
            <Typography
              variant="body2"
              sx={{
                color: '#475569',
                mt: 1.5,
                maxWidth: 280,
                fontSize: '0.95rem',
                lineHeight: 1.5,
              }}
            >
              Join our community to make a difference.
            </Typography>
          </Box>

          <Box sx={{ my: 'auto', py: 2 }}>
            <AuthHeroIllustration />
          </Box>

          <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 500 }}>
            Smart Complaint Management System
          </Typography>
        </Box>

        {/* Right Form Panel */}
        <Box
          sx={{
            flex: 1,
            p: { xs: 3, sm: 4, md: 5 },
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <Box sx={{ mb: 2.5 }}>
            <Typography variant="h5" fontWeight={800} color="#0f172a">
              Create Account
            </Typography>
            <Typography variant="body2" color="#64748b" sx={{ mt: 0.5 }}>
              Register as a new user
            </Typography>
          </Box>

          {serverError && (
            <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
              {serverError}
            </Alert>
          )}

          {successMessage && (
            <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }}>
              {successMessage}
            </Alert>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <FormField label="Full Name" required error={errors.name} sx={{ mb: 1.8 }}>
              <Input
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                error={Boolean(errors.name)}
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonOutlineOutlinedIcon fontSize="small" sx={{ color: '#94a3b8' }} />
                    </InputAdornment>
                  ),
                }}
              />
            </FormField>

            <FormField label="Email Address" required error={errors.email} sx={{ mb: 1.8 }}>
              <Input
                name="email"
                type="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                error={Boolean(errors.email)}
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailOutlinedIcon fontSize="small" sx={{ color: '#94a3b8' }} />
                    </InputAdornment>
                  ),
                }}
              />
            </FormField>

            <FormField label="Password" required error={errors.password} sx={{ mb: 1.8 }}>
              <Input
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                error={Boolean(errors.password)}
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlinedIcon fontSize="small" sx={{ color: '#94a3b8' }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        size="small"
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </FormField>

            <FormField label="Confirm Password" required error={errors.confirmPassword} sx={{ mb: 1.8 }}>
              <Input
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                error={Boolean(errors.confirmPassword)}
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlinedIcon fontSize="small" sx={{ color: '#94a3b8' }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        size="small"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        edge="end"
                      >
                        {showConfirmPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </FormField>

            <FormField label="Select Role" sx={{ mb: 2.2 }}>
              <Select
                name="role"
                value={formData.role}
                onChange={handleChange}
                options={roleOptions}
                size="small"
              />
            </FormField>

            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              loading={loading}
              sx={{
                py: 1.2,
                bgcolor: '#1d68f6',
                '&:hover': { bgcolor: '#1a5bd8' },
                borderRadius: 2.5,
                fontWeight: 700,
                fontSize: '0.95rem',
              }}
            >
              Register
            </Button>
          </form>

          <Box sx={{ mt: 2.5, textAlign: 'center' }}>
            <Typography variant="body2" color="#64748b">
              Already have an account?{' '}
              <MuiLink
                component={Link}
                to="/login"
                underline="hover"
                sx={{ color: '#1d68f6', fontWeight: 700 }}
              >
                Login
              </MuiLink>
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Register;
