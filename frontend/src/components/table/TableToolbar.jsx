import { Box, Stack } from '@mui/material';
import SearchInput from '../forms/SearchInput';
import StatusSelect from '../forms/StatusSelect';

export const TableToolbar = ({
  search = '',
  onSearchChange,
  status = '',
  onStatusChange,
  showStatusFilter = true,
  actionButton,
  extraFilters,
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 2,
        mb: 2.5,
      }}
    >
      <Stack direction="row" spacing={2} sx={{ flexWrap: 'wrap', gap: 1.5 }}>
        <SearchInput
          value={search}
          onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
          onClear={() => onSearchChange && onSearchChange('')}
        />

        {showStatusFilter && (
          <StatusSelect
            value={status}
            onChange={(e) => onStatusChange && onStatusChange(e.target.value)}
            includeAll
          />
        )}

        {extraFilters}
      </Stack>

      {actionButton && <Box>{actionButton}</Box>}
    </Box>
  );
};

export default TableToolbar;

