import { Box, Card, CardContent, Typography } from '@mui/material';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import HourglassEmptyOutlinedIcon from '@mui/icons-material/HourglassEmptyOutlined';

export const DashboardCards = ({ stats = {} }) => {
  const cards = [
    {
      title: 'Total Complaints',
      count: stats.total || 0,
      trend: '↑ 12%',
      icon: <DescriptionOutlinedIcon fontSize="medium" />,
      color: '#1d68f6',
      bgColor: '#eaf2ff',
    },
    {
      title: 'Pending',
      count: stats.pending || 0,
      trend: '↑ 5%',
      icon: <AccessTimeOutlinedIcon fontSize="medium" />,
      color: '#d97706',
      bgColor: '#fff7ed',
    },
    {
      title: 'Resolved',
      count: stats.resolved || 0,
      trend: '↑ 8%',
      icon: <CheckCircleOutlineOutlinedIcon fontSize="medium" />,
      color: '#16a34a',
      bgColor: '#f0fdf4',
    },
    {
      title: 'In Progress',
      count: stats.inProgress || 0,
      trend: '↑ 2%',
      icon: <HourglassEmptyOutlinedIcon fontSize="medium" />,
      color: '#9333ea',
      bgColor: '#faf5ff',
    },
  ];

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          sm: 'repeat(2, 1fr)',
          lg: 'repeat(4, 1fr)',
        },
        gap: 3,
        mb: 3.5,
        width: '100%',
      }}
    >
      {cards.map((card) => (
        <Card
          key={card.title}
          elevation={0}
          sx={{
            borderRadius: 3.5,
            border: '1px solid #e2e8f0',
            bgcolor: '#ffffff',
            boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
            transition: 'transform 0.15s, box-shadow 0.15s',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 6px 16px rgba(0,0,0,0.06)',
            },
          }}
        >
          <CardContent sx={{ p: '22px 24px !important' }}>
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: 2.5,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: card.bgColor,
                color: card.color,
                mb: 2,
              }}
            >
              {card.icon}
            </Box>

            <Typography
              variant="body2"
              color="#64748b"
              fontWeight={600}
              sx={{ mb: 0.7, fontSize: '0.875rem' }}
            >
              {card.title}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1.2 }}>
              <Typography variant="h4" fontWeight={800} color="#0f172a" sx={{ fontSize: '1.85rem' }}>
                {card.count}
              </Typography>
              <Typography
                variant="caption"
                fontWeight={700}
                sx={{ color: '#16a34a', fontSize: '0.8rem' }}
              >
                {card.trend}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export default DashboardCards;
