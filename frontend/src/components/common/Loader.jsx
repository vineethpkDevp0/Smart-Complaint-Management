import { Box, CircularProgress, Typography } from '@mui/material';

export const Loader = ({
  message = 'Loading...',
  size = 40,
  minHeight = '200px',
  color = 'primary',
}) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight={minHeight}
      gap={2}
      py={4}
    >
      <CircularProgress size={size} color={color} />
      {message && (
        <Typography variant="body2" color="text.secondary">
          {message}
        </Typography>
      )}
    </Box>
  );
};

export default Loader;

