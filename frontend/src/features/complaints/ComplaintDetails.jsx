import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Chip,
  Divider,
  Paper,
  Alert,
  Avatar,
  TextField,
  MenuItem,
  Select as MuiSelect,
  FormControl,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import complaintService from './complaintService';
import useAuth from '../../hooks/useAuth';
import { STATUS } from '../../utils/constants';

export const ComplaintDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();

  const [complaint, setComplaint] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [postingComment, setPostingComment] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        const res = await complaintService.getComplaintById(id);
        const data = res.data;
        setComplaint(data);
        setSelectedStatus(data.status || STATUS.PENDING);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load complaint details.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchDetails();
    }
  }, [id]);

  const handleUpdateStatus = async () => {
    if (!selectedStatus || selectedStatus === complaint?.status) return;

    try {
      setUpdatingStatus(true);
      setError('');
      const res = await complaintService.updateComplaintStatus(id, selectedStatus);
      setComplaint((prev) => ({
        ...prev,
        status: res.complaint?.status || selectedStatus,
      }));
      setSuccess('Status updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update status.');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handlePostComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      setPostingComment(true);
      setError('');
      const res = await complaintService.addComment(id, newComment);
      if (res.complaint) {
        setComplaint(res.complaint);
      } else {
        // Fallback local append
        const added = {
          user: user?._id,
          name: user?.name || 'User',
          text: newComment.trim(),
          createdAt: new Date(),
        };
        setComplaint((prev) => ({
          ...prev,
          comments: [...(prev.comments || []), added],
        }));
      }
      setNewComment('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to post comment.');
    } finally {
      setPostingComment(false);
    }
  };

  if (loading) {
    return <Loader message="Loading complaint details..." />;
  }

  if (!complaint) {
    return (
      <Box sx={{ p: 2 }}>
        <Alert severity="error">{error || 'Complaint not found.'}</Alert>
        <Button sx={{ mt: 2 }} onClick={() => navigate('/complaints')}>
          Back to Complaints
        </Button>
      </Box>
    );
  }

  const getStatusStyle = (status) => {
    switch (status) {
      case STATUS.PENDING:
        return { bg: '#fef3c7', color: '#d97706' };
      case STATUS.IN_PROGRESS:
        return { bg: '#e0f2fe', color: '#0284c7' };
      case STATUS.RESOLVED:
        return { bg: '#d1fae5', color: '#059669' };
      default:
        return { bg: '#f1f5f9', color: '#64748b' };
    }
  };

  const statusStyle = getStatusStyle(complaint.status);
  const submitterName = complaint.user?.name || user?.name || 'John Doe';
  const submitterEmail = complaint.user?.email || user?.email || 'user@example.com';
  const commentsList = complaint.comments || [];

  return (
    <Box sx={{ maxWidth: 760, mx: 'auto' }}>
      {/* Top Back Action Button */}
      <Box sx={{ mb: 2.5 }}>
        <Button
          variant="outlined"
          color="inherit"
          startIcon={<ArrowBackIcon fontSize="small" />}
          onClick={() => navigate('/complaints')}
          sx={{
            borderRadius: 2,
            px: 2,
            py: 0.6,
            color: '#64748b',
            borderColor: '#e2e8f0',
            bgcolor: '#ffffff',
            textTransform: 'none',
            fontSize: '0.85rem',
            fontWeight: 600,
          }}
        >
          Back
        </Button>
      </Box>

      {/* Page Title */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" fontWeight={800} color="#0f172a">
          Complaint Details
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

      {/* Main Details Card */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: 3.5,
          border: '1px solid #e2e8f0',
          p: { xs: 2.5, sm: 4 },
          bgcolor: '#ffffff',
          mb: 3,
        }}
      >
        {/* Title & Status */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box
              sx={{
                width: 42,
                height: 42,
                borderRadius: 2.5,
                bgcolor: '#eff6ff',
                color: '#1d68f6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <DescriptionOutlinedIcon fontSize="medium" />
            </Box>
            <Typography variant="h6" fontWeight={800} color="#0f172a">
              {complaint.title}
            </Typography>
          </Box>

          <Chip
            label={complaint.status}
            sx={{
              bgcolor: statusStyle.bg,
              color: statusStyle.color,
              fontWeight: 700,
              fontSize: '0.8rem',
              height: 28,
              borderRadius: 1.5,
              border: 'none',
              px: 1,
            }}
          />
        </Box>

        {/* Description Section */}
        <Box sx={{ mb: 2.5 }}>
          <Typography variant="subtitle2" fontWeight={700} color="#0f172a" gutterBottom>
            Description:
          </Typography>
          <Typography variant="body2" color="#475569" sx={{ lineHeight: 1.6 }}>
            {complaint.description}
          </Typography>
        </Box>

        {/* Submitted By */}
        <Box sx={{ mb: 2.5 }}>
          <Typography variant="subtitle2" fontWeight={700} color="#0f172a" gutterBottom>
            Submitted By:
          </Typography>
          <Typography variant="body2" color="#475569">
            {submitterName} ({submitterEmail})
          </Typography>
        </Box>

        {/* Created At */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" fontWeight={700} color="#0f172a" gutterBottom>
            Created At:
          </Typography>
          <Typography variant="body2" color="#475569">
            {new Date(complaint.createdAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
            {', '}
            {new Date(complaint.createdAt).toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Typography>
        </Box>

        <Divider sx={{ my: 3, borderColor: '#f1f5f9' }} />

        {/* Status Update section (Visible for Admin) */}
        {isAdmin && (
          <Box sx={{ mb: 4 }}>
            <Typography variant="subtitle2" fontWeight={700} color="#0f172a" sx={{ mb: 1.5 }}>
              Status Update
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
              <FormControl size="small" sx={{ minWidth: 180 }}>
                <MuiSelect
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  sx={{ borderRadius: 2 }}
                >
                  <MenuItem value={STATUS.PENDING}>Pending</MenuItem>
                  <MenuItem value={STATUS.IN_PROGRESS}>In Progress</MenuItem>
                  <MenuItem value={STATUS.RESOLVED}>Resolved</MenuItem>
                </MuiSelect>
              </FormControl>
              <Button
                variant="contained"
                onClick={handleUpdateStatus}
                loading={updatingStatus}
                sx={{
                  bgcolor: '#1d68f6',
                  '&:hover': { bgcolor: '#1a5bd8' },
                  borderRadius: 2,
                  fontWeight: 700,
                  px: 2.5,
                }}
              >
                Update Status
              </Button>
            </Box>
          </Box>
        )}

        <Divider sx={{ my: 3, borderColor: '#f1f5f9' }} />

        {/* Comments Section */}
        <Box>
          <Typography variant="subtitle2" fontWeight={800} color="#0f172a" sx={{ mb: 2 }}>
            Comments ({commentsList.length})
          </Typography>

          {/* Add Comment Input */}
          <Box component="form" onSubmit={handlePostComment} sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', gap: 1.5 }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  },
                }}
              />
              <Button
                type="submit"
                variant="contained"
                loading={postingComment}
                sx={{
                  bgcolor: '#1d68f6',
                  '&:hover': { bgcolor: '#1a5bd8' },
                  borderRadius: 2,
                  fontWeight: 700,
                  px: 3,
                }}
              >
                Post
              </Button>
            </Box>
          </Box>

          {/* Comments List */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {commentsList.map((comm, idx) => (
              <Box key={idx} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                <Avatar
                  sx={{
                    width: 34,
                    height: 34,
                    bgcolor: '#bfdbfe',
                    color: '#1d4ed8',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                  }}
                >
                  {comm.name ? comm.name.slice(0, 2).toUpperCase() : 'JD'}
                </Avatar>
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body2" fontWeight={700} color="#0f172a">
                      {comm.name || 'User'}
                    </Typography>
                    <Typography variant="caption" color="#94a3b8">
                      {new Date(comm.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                      {', '}
                      {new Date(comm.createdAt).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="#475569" sx={{ mt: 0.3 }}>
                    {comm.text}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default ComplaintDetails;
