import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Box,
} from '@mui/material';
import { STATUS_OPTIONS, STATUS_COLORS } from '../../utils/constants';

export const StatusSelect = ({
  value = '',
  onChange,
  includeAll = false,
  allLabel = 'All Statuses',
  label = 'Status',
  size = 'small',
  sx = {},
  disabled = false,
}) => {
  return (
    <FormControl size={size} sx={{ minWidth: 160, ...sx }} disabled={disabled}>
      <InputLabel id="status-select-label">{label}</InputLabel>
      <Select
        labelId="status-select-label"
        value={value}
        label={label}
        onChange={onChange}
        sx={{ borderRadius: 2 }}
        renderValue={(selected) => {
          if (!selected && includeAll) {
            return allLabel;
          }
          const color = STATUS_COLORS[selected] || 'default';
          return (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Chip
                label={selected}
                size="small"
                color={color}
                sx={{ fontWeight: 500, height: 24 }}
              />
            </Box>
          );
        }}
      >
        {includeAll && (
          <MenuItem value="">
            <em>{allLabel}</em>
          </MenuItem>
        )}
        {STATUS_OPTIONS.map((status) => (
          <MenuItem key={status} value={status}>
            <Chip
              label={status}
              size="small"
              color={STATUS_COLORS[status] || 'default'}
              sx={{ fontWeight: 500, height: 24, cursor: 'pointer' }}
            />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default StatusSelect;

