import { Box, Typography } from '@mui/material';

export const Logo = ({
  size = 36,
  textColor = 'text.primary',
  showTagline = false,
  taglineColor = 'text.secondary',
  sx = {},
}) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, ...sx }}>
      {/* Blue Shield with Exclamation Mark */}
      <Box
        sx={{
          width: size,
          height: size * 1.15,
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <svg
          viewBox="0 0 24 28"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ width: '100%', height: '100%' }}
        >
          <path
            d="M12 1L2 5V12C2 18.2 6.3 23.9 12 25.5C17.7 23.9 22 18.2 22 12V5L12 1Z"
            fill="#1d68f6"
          />
          <path
            d="M12 2.5L3.5 5.9V12C3.5 17.5 7.1 22.5 12 23.9C16.9 22.5 20.5 17.5 20.5 12V5.9L12 2.5Z"
            fill="#2563eb"
          />
          {/* Exclamation mark */}
          <circle cx="12" cy="18.5" r="1.3" fill="#ffffff" />
          <path
            d="M10.8 7.5H13.2L12.9 15H11.1L10.8 7.5Z"
            fill="#ffffff"
          />
        </svg>
      </Box>

      <Box>
        <Typography
          variant="h6"
          fontWeight={800}
          sx={{
            color: textColor,
            letterSpacing: -0.5,
            lineHeight: 1.1,
            fontSize: size >= 40 ? '1.5rem' : '1.15rem',
          }}
        >
          SmartComplaint<span style={{ color: '#1d68f6' }}>DB</span>
        </Typography>
        {showTagline && (
          <Typography
            variant="caption"
            sx={{
              color: taglineColor,
              fontWeight: 700,
              letterSpacing: 0.5,
              display: 'block',
              mt: 0.2,
            }}
          >
            Report. Track. Resolve.
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default Logo;

