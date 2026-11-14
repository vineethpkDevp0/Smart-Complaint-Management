import { Button as MuiButton, CircularProgress } from '@mui/material';

export const Button = ({
  children,
  variant = 'contained',
  color = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  fullWidth = false,
  startIcon,
  endIcon,
  type = 'button',
  onClick,
  sx = {},
  ...props
}) => {
  return (
    <MuiButton
      variant={variant}
      color={color}
      size={size}
      disabled={disabled || loading}
      fullWidth={fullWidth}
      type={type}
      onClick={onClick}
      startIcon={!loading && startIcon}
      endIcon={!loading && endIcon}
      sx={{
        textTransform: 'none',
        fontWeight: 600,
        borderRadius: 2,
        ...sx,
      }}
      {...props}
    >
      {loading ? (
        <>
          <CircularProgress size={20} color="inherit" sx={{ mr: children ? 1 : 0 }} />
          {children}
        </>
      ) : (
        children
      )}
    </MuiButton>
  );
};

export default Button;

