import { TextField } from '@mui/material';

export const Input = ({
  label,
  name,
  value,
  onChange,
  type = 'text',
  placeholder,
  error = false,
  helperText = '',
  required = false,
  fullWidth = true,
  disabled = false,
  multiline = false,
  rows = 1,
  size = 'medium',
  sx = {},
  ...props
}) => {
  return (
    <TextField
      label={label}
      name={name}
      value={value}
      onChange={onChange}
      type={type}
      placeholder={placeholder}
      error={Boolean(error)}
      helperText={helperText}
      required={required}
      fullWidth={fullWidth}
      disabled={disabled}
      multiline={multiline}
      rows={rows}
      size={size}
      variant="outlined"
      sx={{
        '& .MuiOutlinedInput-root': {
          borderRadius: 2,
        },
        ...sx,
      }}
      {...props}
    />
  );
};

export default Input;

