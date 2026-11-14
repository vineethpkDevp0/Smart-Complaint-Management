import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Link as MuiLink,
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import ReportProblemOutlinedIcon from '@mui/icons-material/ReportProblemOutlined';
import CreditCardOutlinedIcon from '@mui/icons-material/CreditCardOutlined';
import PhoneIphoneOutlinedIcon from '@mui/icons-material/PhoneIphoneOutlined';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import { STATUS } from '../../utils/constants';

const getTimeAgo = (dateStr) => {
  if (!dateStr) return 'Recently';
  const now = Date.now();
  const past = new Date(dateStr).getTime();
  const diffHours = Math.round((now - past) / (1000 * 60 * 60));
  if (diffHours < 1) return 'Just now';
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.round(diffHours / 24);
  return `${diffDays}d ago`;
};

export const RecentComplaintsList = ({ complaints = [] }) => {
  const navigate = useNavigate();

  const getStatusStyle = (status) => {
    switch (status) {
      case STATUS.PENDING:
        return {
          bg: '#fef3c7',
          color: '#d97706',
          iconBg: '#fff7ed',
          iconColor: '#f97316',
          icon: <ReportProblemOutlinedIcon fontSize="small" />,
        };
      case STATUS.IN_PROGRESS:
        return {
          bg: '#e0f2fe',
          color: '#0284c7',
          iconBg: '#eff6ff',
          iconColor: '#1d68f6',
          icon: <CreditCardOutlinedIcon fontSize="small" />,
        };
      case STATUS.RESOLVED:
        return {
          bg: '#dcfce7',
          color: '#15803d',
          iconBg: '#f0fdf4',
          iconColor: '#16a34a',
          icon: <PhoneIphoneOutlinedIcon fontSize="small" />,
        };
      default:
        return {
          bg: '#f1f5f9',
          color: '#64748b',
          iconBg: '#f8fafc',
          iconColor: '#64748b',
          icon: <AssignmentOutlinedIcon fontSize="small" />,
        };
    }
  };

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 3.5,
        border: '1px solid #e2e8f0',
        bgcolor: '#ffffff',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
      }}
    >
      <CardContent sx={{ p: { xs: 2.5, sm: 3 }, flexGrow: 1 }}>
        {/* Header */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 2.5,
          }}
        >
          <Typography variant="h6" fontWeight={800} color="#0f172a" fontSize="1.05rem">
            Recent Complaints
          </Typography>
          <MuiLink
            component={Link}
            to="/complaints"
            underline="hover"
            sx={{
              color: '#1d68f6',
              fontSize: '0.82rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
            }}
          >
            View All →
          </MuiLink>
        </Box>

        {/* Complaints List */}
        {complaints.length === 0 ? (
          <Box sx={{ py: 5, textAlign: 'center' }}>
            <Typography variant="body2" color="#94a3b8">
              No recent complaints.
            </Typography>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {complaints.slice(0, 4).map((c) => {
              const style = getStatusStyle(c.status);
              return (
                <Box
                  key={c._id}
                  onClick={() => navigate(`/complaints/${c._id}`)}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    p: 1.4,
                    borderRadius: 2.5,
                    cursor: 'pointer',
                    transition: 'background 0.15s',
                    '&:hover': {
                      bgcolor: '#f8fafc',
                    },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.8 }}>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        bgcolor: style.iconBg,
                        color: style.iconColor,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      {style.icon}
                    </Box>
                    <Box>
                      <Typography variant="body2" fontWeight={700} color="#0f172a" sx={{ fontSize: '0.9rem' }}>
                        {c.title}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.2 }}>
                        <Typography variant="caption" color="#64748b" fontWeight={500}>
                          {c.status}
                        </Typography>
                        <Typography variant="caption" color="#cbd5e1">
                          •
                        </Typography>
                        <Typography variant="caption" color="#94a3b8">
                          {getTimeAgo(c.createdAt)}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  <Chip
                    label={c.status}
                    size="small"
                    sx={{
                      bgcolor: style.bg,
                      color: style.color,
                      fontWeight: 700,
                      fontSize: '0.75rem',
                      height: 25,
                      borderRadius: 1.5,
                      border: 'none',
                      px: 0.5,
                    }}
                  />
                </Box>
              );
            })}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentComplaintsList;
