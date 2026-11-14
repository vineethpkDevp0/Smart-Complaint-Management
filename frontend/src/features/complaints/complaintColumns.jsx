import { Box, Chip, Typography, IconButton, Tooltip } from '@mui/material';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import { STATUS } from '../../utils/constants';

export const getComplaintColumns = ({
  onView,
  onEdit,
  onDelete,
  currentUserId,
  isAdmin,
  page = 1,
  pageSize = 5,
}) => [
  {
    id: 'index',
    label: '#',
    minWidth: 50,
    render: (_, __, index) => (
      <Typography variant="body2" color="#64748b" fontWeight={600}>
        {(page - 1) * pageSize + index + 1}
      </Typography>
    ),
  },
  {
    id: 'title',
    label: 'Title',
    minWidth: 200,
    render: (value, row) => (
      <Box
        onClick={() => onView(row)}
        sx={{
          cursor: 'pointer',
          '&:hover': { '& .MuiTypography-root': { color: '#1d68f6' } },
        }}
      >
        <Typography variant="body2" fontWeight={700} color="#0f172a">
          {value}
        </Typography>
        {row.description && (
          <Typography
            variant="caption"
            color="#94a3b8"
            sx={{
              display: '-webkit-box',
              WebkitLineClamp: 1,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {row.description}
          </Typography>
        )}
      </Box>
    ),
  },
  {
    id: 'status',
    label: 'Status',
    minWidth: 120,
    render: (value) => {
      let bg = '#fef3c7';
      let color = '#d97706';

      if (value === STATUS.IN_PROGRESS) {
        bg = '#e0f2fe';
        color = '#0284c7';
      } else if (value === STATUS.RESOLVED) {
        bg = '#d1fae5';
        color = '#059669';
      }

      return (
        <Chip
          label={value}
          size="small"
          sx={{
            bgcolor: bg,
            color: color,
            fontWeight: 700,
            fontSize: '0.75rem',
            height: 24,
            borderRadius: 1.5,
            border: 'none',
          }}
        />
      );
    },
  },
  {
    id: 'createdAt',
    label: 'Created At',
    minWidth: 130,
    render: (value) => {
      if (!value) return '-';
      const date = new Date(value);
      return (
        <Typography variant="body2" color="#64748b" fontWeight={500}>
          {date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })}
        </Typography>
      );
    },
  },
  {
    id: 'actions',
    label: 'Actions',
    align: 'right',
    minWidth: 110,
    render: (_, row) => {
      const isOwner = row.user === currentUserId || row.user?._id === currentUserId;
      const canEdit = isOwner || isAdmin;
      const canDelete = isOwner || isAdmin;

      return (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 0.5 }}>
          {canEdit && (
            <Tooltip title="Edit">
              <IconButton
                size="small"
                onClick={() => onEdit(row)}
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
          )}

          {canDelete && (
            <Tooltip title="Delete">
              <IconButton
                size="small"
                onClick={() => onDelete(row)}
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
          )}
        </Box>
      );
    },
  },
];

export default getComplaintColumns;
