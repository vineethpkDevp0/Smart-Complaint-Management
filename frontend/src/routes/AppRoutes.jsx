import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import AdminRoute from './AdminRoute';
import MainLayout from '../components/layout/MainLayout';
import Login from '../features/auth/Login';
import Register from '../features/auth/Register';
import Dashboard from '../features/dashboard/Dashboard';
import ComplaintList from '../features/complaints/ComplaintList';
import ComplaintForm from '../features/complaints/ComplaintForm';
import ComplaintDetails from '../features/complaints/ComplaintDetails';
import UserManagement from '../features/users/UserManagement';
import Profile from '../features/profile/Profile';
import { Box, Typography, Card, CardContent } from '@mui/material';
import Button from '../components/common/Button';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <Box
      sx={{
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
      }}
    >
      <Card
        elevation={0}
        sx={{
          textAlign: 'center',
          p: 4,
          borderRadius: 3.5,
          border: '1px solid #e2e8f0',
          maxWidth: 450,
          bgcolor: '#ffffff',
        }}
      >
        <CardContent>
          <Typography variant="h1" fontWeight={800} color="#1d68f6" gutterBottom>
            404
          </Typography>
          <Typography variant="h5" fontWeight={700} gutterBottom>
            Page Not Found
          </Typography>
          <Typography variant="body2" color="#64748b" sx={{ mb: 3 }}>
            The page you are looking for does not exist or has been moved.
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/dashboard')}
            sx={{ bgcolor: '#1d68f6', '&:hover': { bgcolor: '#1a5bd8' } }}
          >
            Back to Dashboard
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected Routes inside MainLayout */}
      <Route
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/complaints" element={<ComplaintList />} />
        <Route path="/complaints/new" element={<ComplaintForm />} />
        <Route path="/complaints/:id" element={<ComplaintDetails />} />
        <Route path="/complaints/edit/:id" element={<ComplaintForm />} />
        <Route path="/profile" element={<Profile />} />

        {/* Admin-Only Route for User Management */}
        <Route
          path="/users"
          element={
            <AdminRoute>
              <UserManagement />
            </AdminRoute>
          }
        />
      </Route>

      {/* Catch-all 404 Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
