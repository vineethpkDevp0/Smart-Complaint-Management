import { useState, useEffect } from 'react';
import { Box, Typography, Alert } from '@mui/material';
import DashboardCards from './DashboardCards';
import ComplaintsTrendChart from './ComplaintsTrendChart';
import RecentComplaintsList from './RecentComplaintsList';
import Loader from '../../components/common/Loader';
import complaintService from '../complaints/complaintService';
import { STATUS } from '../../utils/constants';

export const Dashboard = () => {
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0,
  });
  const [recentComplaints, setRecentComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        setError('');

        const [allRes, pendingRes, progressRes, resolvedRes] = await Promise.all([
          complaintService.getComplaints({ page: 1 }),
          complaintService.getComplaints({ status: STATUS.PENDING, page: 1 }),
          complaintService.getComplaints({ status: STATUS.IN_PROGRESS, page: 1 }),
          complaintService.getComplaints({ status: STATUS.RESOLVED, page: 1 }),
        ]);

        setStats({
          total: allRes.total || 0,
          pending: pendingRes.total || 0,
          inProgress: progressRes.total || 0,
          resolved: resolvedRes.total || 0,
        });

        setRecentComplaints(allRes.data || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load dashboard metrics.');
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  return (
    <Box sx={{ width: '100%' }}>
      {/* Page Header */}
      <Box sx={{ mb: 3.5 }}>
        <Typography variant="h5" fontWeight={800} color="#0f172a" sx={{ fontSize: '1.65rem' }}>
          Dashboard
        </Typography>
        <Typography variant="body2" color="#64748b" sx={{ mt: 0.5, fontSize: '0.9rem' }}>
          Overview of complaint management
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Loader message="Loading dashboard data..." />
      ) : (
        <>
          {/* 4 Metric Stat Cards */}
          <DashboardCards stats={stats} />

          {/* Complaints Trend and Recent Complaints side by side in full width */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                lg: '1.45fr 1fr',
              },
              gap: 3,
              width: '100%',
              alignItems: 'stretch',
            }}
          >
            <ComplaintsTrendChart />
            <RecentComplaintsList complaints={recentComplaints} />
          </Box>
        </>
      )}
    </Box>
  );
};

export default Dashboard;
