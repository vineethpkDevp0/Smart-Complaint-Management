import { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Alert,
  Paper,
  InputAdornment,
  TextField,
  MenuItem,
  Select as MuiSelect,
  FormControl,
  Pagination,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import ReusableTable from '../../components/table/ReusableTable';
import Button from '../../components/common/Button';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { getComplaintColumns } from './complaintColumns';
import complaintService from './complaintService';
import useAuth from '../../hooks/useAuth';
import useDebounce from '../../hooks/useDebounce';
import { STATUS_OPTIONS } from '../../utils/constants';

export const ComplaintList = () => {
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();

  const [complaints, setComplaints] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('All Status');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const debouncedSearch = useDebounce(search, 350);

  const fetchComplaints = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const response = await complaintService.getComplaints({
        search: debouncedSearch,
        status: status === 'All Status' ? '' : status,
        page,
      });

      setComplaints(response.data || []);
      setTotal(response.total || 0);
      setTotalPages(response.totalPages || 1);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load complaints.');
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, status, page]);

  useEffect(() => {
    fetchComplaints();
  }, [fetchComplaints]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, status]);

  const handleView = (row) => {
    navigate(`/complaints/${row._id}`);
  };

  const handleEdit = (row) => {
    navigate(`/complaints/edit/${row._id}`);
  };

  const handleDeletePrompt = (row) => {
    setDeleteTarget(row);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      setDeleting(true);
      await complaintService.deleteComplaint(deleteTarget._id);
      setDeleteTarget(null);
      fetchComplaints();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete complaint.');
    } finally {
      setDeleting(false);
    }
  };

  const columns = getComplaintColumns({
    onView: handleView,
    onEdit: handleEdit,
    onDelete: handleDeletePrompt,
    currentUserId: user?._id,
    isAdmin,
    page,
    pageSize: 5,
  });

  const startRecord = total === 0 ? 0 : (page - 1) * 5 + 1;
  const endRecord = Math.min(page * 5, total);

  return (
    <Box>
      {/* Page Title & Subtitle */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" fontWeight={800} color="#0f172a">
          Complaints
        </Typography>
        <Typography variant="body2" color="#64748b" sx={{ mt: 0.5 }}>
          Manage and track all complaints
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2.5, borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      {/* Main Card */}
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
          {/* Left: Search & Filter */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
            <TextField
              size="small"
              placeholder="Search by title or description..."
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

            <FormControl size="small" sx={{ minWidth: 140 }}>
              <MuiSelect
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                sx={{ borderRadius: 2.5 }}
              >
                <MenuItem value="All Status">All Status</MenuItem>
                {STATUS_OPTIONS.map((st) => (
                  <MenuItem key={st} value={st}>
                    {st}
                  </MenuItem>
                ))}
              </MuiSelect>
            </FormControl>
          </Box>

          {/* Right: + New Complaint Button */}
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/complaints/new')}
            sx={{
              bgcolor: '#1d68f6',
              '&:hover': { bgcolor: '#1a5bd8' },
              borderRadius: 2.5,
              fontWeight: 700,
              px: 2.5,
              py: 1,
            }}
          >
            + New Complaint
          </Button>
        </Box>

        {/* Data Table */}
        <ReusableTable
          columns={columns}
          data={complaints}
          loading={loading}
          emptyMessage="No complaints found."
        />

        {/* Bottom Pagination Bar */}
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
            Showing {startRecord}-{endRecord} of {total}
          </Typography>

          {totalPages > 1 && (
            <Pagination
              count={totalPages}
              page={page}
              onChange={(_, val) => setPage(val)}
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
                    '&:hover': { bgcolor: '#1a5bd8' },
                  },
                },
              }}
            />
          )}
        </Box>
      </Paper>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete Complaint"
        message={`Are you sure you want to delete "${deleteTarget?.title}"?`}
        confirmText="Delete"
        confirmColor="error"
        loading={deleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </Box>
  );
};

export default ComplaintList;
