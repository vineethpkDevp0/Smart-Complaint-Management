import {
  FormControl,
  InputLabel,
  Select as MuiSelect,
  MenuItem,
  FormHelperText,
} from '@mui/material';

export const Select = ({
  label,
  name,
  value,
  onChange,
  options = [],
  error = false,
  helperText = '',
  required = false,
  fullWidth = true,
  disabled = false,
  size = 'medium',
  sx = {},
  ...props
}) => {
  const labelId = `${name || 'select'}-label`;

  return (
    <FormControl
      fullWidth={fullWidth}
      error={Boolean(error)}
      required={required}
      disabled={disabled}
      size={size}
      sx={{ ...sx }}
    >
      {label && <InputLabel id={labelId}>{label}</InputLabel>}
      <MuiSelect
        labelId={labelId}
        name={name}
        value={value}
        label={label}
        onChange={onChange}
        sx={{ borderRadius: 2 }}
        {...props}
      >
        {options.map((opt) => {
          const itemValue = typeof opt === 'object' ? opt.value : opt;
          const itemLabel = typeof opt === 'object' ? opt.label : opt;
          return (
            <MenuItem key={itemValue} value={itemValue}>
              {itemLabel}
            </MenuItem>
          );
        })}
      </MuiSelect>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
};

export default Select;

