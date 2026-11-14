import { Box, Typography } from '@mui/material';

export const FormField = ({
  label,
  required = false,
  error = '',
  helperText = '',
  children,
  sx = {},
}) => {
  return (
    <Box sx={{ mb: 2.5, width: '100%', ...sx }}>
      {label && (
        <Typography
          variant="body2"
          fontWeight={500}
          color="text.primary"
          sx={{ mb: 0.75 }}
        >
          {label}
          {required && (
            <Box component="span" sx={{ color: 'error.main', ml: 0.5 }}>
              *
            </Box>
          )}
        </Typography>
      )}
      {children}
      {(error || helperText) && (
        <Typography
          variant="caption"
          color={error ? 'error.main' : 'text.secondary'}
          sx={{ display: 'block', mt: 0.5, ml: 0.5 }}
        >
          {error || helperText}
        </Typography>
      )}
    </Box>
  );
};

export default FormField;

