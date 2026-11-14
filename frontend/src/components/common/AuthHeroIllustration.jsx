import { Box } from '@mui/material';

export const AuthHeroIllustration = ({ sx = {} }) => {
  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: 380,
        height: 280,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        ...sx,
      }}
    >
      <svg
        viewBox="0 0 400 300"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: '100%', height: '100%' }}
      >
        {/* Soft Background Blob */}
        <path
          d="M60 160C40 90 120 40 210 50C300 60 360 120 340 190C320 260 210 270 140 250C70 230 80 230 60 160Z"
          fill="#dbeafe"
          opacity="0.7"
        />

        {/* Floating Plant / Leaves on left */}
        <path
          d="M50 250C45 220 55 190 70 170C75 195 70 225 50 250Z"
          fill="#3b82f6"
          opacity="0.6"
        />
        <path
          d="M60 255C75 235 95 220 115 215C105 235 90 250 60 255Z"
          fill="#60a5fa"
          opacity="0.8"
        />

        {/* Laptop Base */}
        <ellipse cx="180" cy="245" rx="110" ry="12" fill="#bfdbfe" opacity="0.6" />
        <path
          d="M90 235L260 235C266 235 272 239 268 243L245 252C243 253 240 254 237 254L113 254C110 254 107 253 105 252L82 243C78 239 84 235 90 235Z"
          fill="#94a3b8"
        />
        <rect x="155" y="235" width="40" height="4" rx="2" fill="#cbd5e1" />

        {/* Laptop Screen */}
        <rect
          x="100"
          y="100"
          width="150"
          height="136"
          rx="8"
          fill="#1e293b"
          transform="skewX(-6)"
        />
        {/* Inner Screen Display */}
        <rect
          x="106"
          y="107"
          width="138"
          height="122"
          rx="4"
          fill="#3b82f6"
          transform="skewX(-6)"
        />
        {/* Screen Content lines */}
        <rect x="120" y="125" width="45" height="6" rx="3" fill="#ffffff" opacity="0.9" />
        <rect x="120" y="140" width="80" height="4" rx="2" fill="#bfdbfe" />
        <rect x="120" y="152" width="65" height="4" rx="2" fill="#bfdbfe" />
        <rect x="120" y="164" width="75" height="4" rx="2" fill="#bfdbfe" />
        {/* Graph on screen */}
        <path
          d="M120 200L145 185L170 192L195 175"
          stroke="#ffffff"
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* Megaphone (Speaking / Broadcasting Complaints) */}
        <g transform="translate(230, 95) rotate(-15)">
          {/* Sound waves */}
          <path
            d="M95 15C105 25 105 55 95 65"
            stroke="#1d68f6"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <path
            d="M110 5C125 22 125 68 110 85"
            stroke="#60a5fa"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Cone body */}
          <path
            d="M20 30L70 10L70 70L20 50Z"
            fill="#2563eb"
          />
          {/* Bell / rim */}
          <ellipse cx="70" cy="40" rx="6" ry="30" fill="#1d4ed8" />
          {/* Handle */}
          <path
            d="M32 45L30 75C30 78 35 80 38 77L44 48Z"
            fill="#1e293b"
          />
          {/* Back cap */}
          <ellipse cx="20" cy="40" rx="5" ry="10" fill="#60a5fa" />
        </g>
      </svg>
    </Box>
  );
};

export default AuthHeroIllustration;

