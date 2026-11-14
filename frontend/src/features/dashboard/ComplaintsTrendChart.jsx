import { Box, Card, CardContent, Typography } from '@mui/material';

export const ComplaintsTrendChart = () => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

  // Trend points matching the mockup curves
  // Total line (Blue)
  const totalPoints = [
    { x: 60, y: 150 },
    { x: 150, y: 120 },
    { x: 240, y: 90 },
    { x: 330, y: 105 },
    { x: 420, y: 75 },
    { x: 500, y: 85 },
  ];

  // Resolved line (Green)
  const resolvedPoints = [
    { x: 60, y: 185 },
    { x: 150, y: 168 },
    { x: 240, y: 145 },
    { x: 330, y: 138 },
    { x: 420, y: 120 },
    { x: 500, y: 112 },
  ];

  const totalPath = totalPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const resolvedPath = resolvedPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 3.5,
        border: '1px solid #e2e8f0',
        bgcolor: '#ffffff',
        height: '100%',
        boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
      }}
    >
      <CardContent sx={{ p: { xs: 2.5, sm: 3 } }}>
        {/* Header and Legend */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 3,
          }}
        >
          <Typography variant="h6" fontWeight={800} color="#0f172a" fontSize="1.05rem">
            Complaints Trend
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
              <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#1d68f6' }} />
              <Typography variant="caption" color="#64748b" fontWeight={600} fontSize="0.8rem">
                Total
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
              <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#10b981' }} />
              <Typography variant="caption" color="#64748b" fontWeight={600} fontSize="0.8rem">
                Resolved
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Responsive SVG Chart */}
        <Box sx={{ width: '100%', minHeight: 220 }}>
          <svg
            viewBox="0 0 540 220"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ width: '100%', height: 'auto', display: 'block' }}
          >
            {/* Grid horizontal lines */}
            {[
              { label: '20', y: 45 },
              { label: '15', y: 85 },
              { label: '10', y: 125 },
              { label: '5', y: 165 },
              { label: '0', y: 195 },
            ].map((grid) => (
              <g key={grid.label}>
                <text
                  x="24"
                  y={grid.y + 4}
                  fill="#94a3b8"
                  fontSize="11"
                  fontWeight="500"
                  textAnchor="end"
                >
                  {grid.label}
                </text>
                <line
                  x1="38"
                  y1={grid.y}
                  x2="520"
                  y2={grid.y}
                  stroke="#f1f5f9"
                  strokeWidth="1.2"
                />
              </g>
            ))}

            {/* Total Line (Blue) */}
            <path
              d={totalPath}
              stroke="#1d68f6"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {totalPoints.map((p, i) => (
              <circle
                key={i}
                cx={p.x}
                cy={p.y}
                r="4.5"
                fill="#ffffff"
                stroke="#1d68f6"
                strokeWidth="2.5"
              />
            ))}

            {/* Resolved Line (Green) */}
            <path
              d={resolvedPath}
              stroke="#10b981"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {resolvedPoints.map((p, i) => (
              <circle
                key={i}
                cx={p.x}
                cy={p.y}
                r="4.5"
                fill="#ffffff"
                stroke="#10b981"
                strokeWidth="2.5"
              />
            ))}

            {/* X-axis Month Labels */}
            {months.map((m, i) => {
              const xPos = 60 + i * 88;
              return (
                <text
                  key={m}
                  x={xPos}
                  y="214"
                  fill="#94a3b8"
                  fontSize="11"
                  fontWeight="600"
                  textAnchor="middle"
                >
                  {m}
                </text>
              );
            })}
          </svg>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ComplaintsTrendChart;
