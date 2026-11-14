import { Box, Pagination, Typography } from '@mui/material';

export const TablePagination = ({
  page = 1,
  totalPages = 1,
  total = 0,
  onPageChange,
  showTotal = true,
  disabled = false,
}) => {
  const handleChange = (event, value) => {
    if (onPageChange && value !== page) {
      onPageChange(value);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 2,
        mt: 2.5,
        px: 1,
      }}
    >
      {showTotal && (
        <Typography variant="body2" color="text.secondary">
          {total > 0 ? `Total: ${total} record${total > 1 ? 's' : ''}` : 'No records'}
        </Typography>
      )}

      {totalPages > 1 && (
        <Pagination
          count={totalPages}
          page={page}
          onChange={handleChange}
          color="primary"
          shape="rounded"
          disabled={disabled}
          showFirstButton
          showLastButton
        />
      )}
    </Box>
  );
};

export default TablePagination;

