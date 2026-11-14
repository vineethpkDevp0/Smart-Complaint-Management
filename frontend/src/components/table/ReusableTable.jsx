import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  Typography,
} from '@mui/material';
import Loader from '../common/Loader';

export const ReusableTable = ({
  columns = [],
  data = [],
  loading = false,
  emptyMessage = 'No records found.',
  keyField = '_id',
  onRowClick,
}) => {
  return (
    <TableContainer
      sx={{
        width: '100%',
        overflowX: 'auto',
      }}
    >
      <Table sx={{ minWidth: 600 }}>
        <TableHead>
          <TableRow sx={{ borderBottom: '1px solid #f1f5f9' }}>
            {columns.map((col) => (
              <TableCell
                key={col.id}
                align={col.align || 'left'}
                sx={{
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  color: '#64748b',
                  py: 1.5,
                  px: 2,
                  borderBottom: '1px solid #f1f5f9',
                  minWidth: col.minWidth,
                }}
              >
                {col.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={columns.length} align="center" sx={{ py: 6, borderBottom: 'none' }}>
                <Loader message="Loading data..." />
              </TableCell>
            </TableRow>
          ) : data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length} align="center" sx={{ py: 6, borderBottom: 'none' }}>
                <Box sx={{ py: 2 }}>
                  <Typography variant="body2" color="#94a3b8">
                    {emptyMessage}
                  </Typography>
                </Box>
              </TableCell>
            </TableRow>
          ) : (
            data.map((row, index) => (
              <TableRow
                key={row[keyField] || index}
                hover
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                sx={{
                  cursor: onRowClick ? 'pointer' : 'default',
                  borderBottom: '1px solid #f8fafc',
                  '&:last-child td': { borderBottom: 'none' },
                  '&:hover': {
                    bgcolor: '#f8fafc !important',
                  },
                }}
              >
                {columns.map((col) => (
                  <TableCell
                    key={col.id}
                    align={col.align || 'left'}
                    sx={{
                      py: 1.6,
                      px: 2,
                      borderBottom: '1px solid #f1f5f9',
                    }}
                  >
                    {col.render ? col.render(row[col.id], row, index) : row[col.id]}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ReusableTable;
