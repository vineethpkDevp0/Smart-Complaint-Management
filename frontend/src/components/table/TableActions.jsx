import { Box, IconButton, Tooltip } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

export const TableActions = ({
  onView,
  onEdit,
  onDelete,
  canEdit = true,
  canDelete = true,
  extraActions,
}) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
      {onView && (
        <Tooltip title="View Details">
          <IconButton size="small" color="primary" onClick={onView}>
            <VisibilityIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      )}

      {onEdit && canEdit && (
        <Tooltip title="Edit">
          <IconButton size="small" color="info" onClick={onEdit}>
            <EditIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      )}

      {onDelete && canDelete && (
        <Tooltip title="Delete">
          <IconButton size="small" color="error" onClick={onDelete}>
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      )}

      {extraActions}
    </Box>
  );
};

export default TableActions;

