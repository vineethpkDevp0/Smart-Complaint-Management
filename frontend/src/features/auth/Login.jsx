import { useState } from 'react';
import {
  Box,
  Typography,
  Alert,
  Checkbox,
  FormControlLabel,
  Link as MuiLink,
  InputAdornment,
  IconButton,
  Divider,
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import FormField from '../../components/forms/FormField';
import Logo from '../../components/common/Logo';
import AuthHeroIllustration from '../../components/common/AuthHeroIllustration';
import useAuth from '../../hooks/useAuth';
import { validateLoginForm } from '../../utils/validation';

export const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

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
    const validation = validateLoginForm(formData);

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    try {
      setLoading(true);
      setServerError('');
      await login(formData);
      navigate('/dashboard');
    } catch (err) {
      const msg =
        err.response?.data?.message || 'Login failed. Please check your credentials.';
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
          minHeight: 560,
          border: '1px solid #e2e8f0',
        }}
      >
        {/* Left Hero Panel (Light blue gradient) */}
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
            position: 'relative',
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
              A smarter way to manage complaints and resolve issues.
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
            p: { xs: 3, sm: 5, md: 6 },
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <Box sx={{ mb: 3 }}>
            <Typography variant="h5" fontWeight={800} color="#0f172a">
              Welcome Back
            </Typography>
            <Typography variant="body2" color="#64748b" sx={{ mt: 0.5 }}>
              Sign in to your account
            </Typography>
          </Box>

          {serverError && (
            <Alert severity="error" sx={{ mb: 2.5, borderRadius: 2 }}>
              {serverError}
            </Alert>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <FormField label="Email Address" required error={errors.email}>
              <Input
                name="email"
                type="email"
                placeholder="name@example.com"
                value={formData.email}
                onChange={handleChange}
                error={Boolean(errors.email)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailOutlinedIcon fontSize="small" sx={{ color: '#94a3b8' }} />
                    </InputAdornment>
                  ),
                }}
              />
            </FormField>

            <FormField label="Password" required error={errors.password}>
              <Input
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter password"
                value={formData.password}
                onChange={handleChange}
                error={Boolean(errors.password)}
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

            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                mt: 1,
                mb: 2.5,
              }}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    size="small"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    sx={{ color: '#94a3b8', '&.Mui-checked': { color: '#1d68f6' } }}
                  />
                }
                label={
                  <Typography variant="body2" color="#64748b">
                    Remember me
                  </Typography>
                }
              />
              <MuiLink
                component={Link}
                to="#"
                variant="body2"
                underline="hover"
                sx={{ color: '#1d68f6', fontWeight: 600, fontSize: '0.85rem' }}
              >
                Forgot password?
              </MuiLink>
            </Box>

            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              loading={loading}
              sx={{
                py: 1.3,
                bgcolor: '#1d68f6',
                '&:hover': { bgcolor: '#1a5bd8' },
                borderRadius: 2.5,
                fontWeight: 700,
                fontSize: '0.95rem',
              }}
            >
              Login
            </Button>
          </form>

          <Box sx={{ my: 3, display: 'flex', alignItems: 'center' }}>
            <Divider sx={{ flexGrow: 1 }} />
            <Typography variant="caption" sx={{ px: 2, color: '#94a3b8', textTransform: 'lowercase' }}>
              or
            </Typography>
            <Divider sx={{ flexGrow: 1 }} />
          </Box>

          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" color="#64748b">
              Don't have an account?{' '}
              <MuiLink
                component={Link}
                to="/register"
                underline="hover"
                sx={{ color: '#1d68f6', fontWeight: 700 }}
              >
                Register
              </MuiLink>
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Login;
