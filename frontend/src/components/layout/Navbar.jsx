import { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Avatar,
  Badge,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import NotificationsNoneRoundedIcon from '@mui/icons-material/NotificationsNoneRounded';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import PersonOutlineRoundedIcon from '@mui/icons-material/PersonOutlineRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

export const Navbar = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleOpenUserMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorEl(null);
  };

  const handleProfileClick = () => {
    handleCloseUserMenu();
    navigate('/profile');
  };

  const handleLogout = () => {
    handleCloseUserMenu();
    logout();
    navigate('/login');
  };

  // Extract initials (e.g. John Doe -> JD)
  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <AppBar
      position="sticky"
      color="inherit"
      elevation={0}
      sx={{
        bgcolor: '#ffffff',
        borderBottom: '1px solid #e2e8f0',
        zIndex: (theme) => theme.zIndex.drawer - 1,
        ml: { md: '240px' },
        width: { md: 'calc(100% - 240px)' },
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2, sm: 3 }, minHeight: 64 }}>
        {/* Left: Menu toggle */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={onToggleSidebar}
            sx={{ color: '#64748b' }}
          >
            <MenuRoundedIcon />
          </IconButton>
        </Box>

        {/* Right: Notifications & User Profile */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {/* Notification Bell with Red Badge */}
          <IconButton
            size="small"
            sx={{
              color: '#475569',
              bgcolor: '#f8fafc',
              p: 1,
              borderRadius: 2,
              '&:hover': { bgcolor: '#f1f5f9' },
            }}
          >
            <Badge
              badgeContent={3}
              sx={{
                '& .MuiBadge-badge': {
                  bgcolor: '#ef4444',
                  color: '#ffffff',
                  fontSize: '0.65rem',
                  height: 16,
                  minWidth: 16,
                  px: 0.5,
                  fontWeight: 700,
                },
              }}
            >
              <NotificationsNoneRoundedIcon fontSize="small" />
            </Badge>
          </IconButton>

          {/* User Details Dropdown Trigger */}
          <Box
            onClick={handleOpenUserMenu}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.2,
              cursor: 'pointer',
              py: 0.5,
              px: 1,
              borderRadius: 2,
              transition: 'background 0.15s',
              '&:hover': { bgcolor: '#f8fafc' },
            }}
          >
            <Avatar
              sx={{
                width: 34,
                height: 34,
                bgcolor: '#0f172a',
                color: '#ffffff',
                fontSize: '0.85rem',
                fontWeight: 700,
              }}
            >
              {getInitials(user?.name)}
            </Avatar>

            <Typography
              variant="body2"
              fontWeight={700}
              sx={{ color: '#0f172a', display: { xs: 'none', sm: 'block' } }}
            >
              {user?.name || 'User'}
            </Typography>

            <KeyboardArrowDownRoundedIcon fontSize="small" sx={{ color: '#64748b' }} />
          </Box>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleCloseUserMenu}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            PaperProps={{
              sx: {
                minWidth: 180,
                mt: 1,
                borderRadius: 3,
                boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
                border: '1px solid #e2e8f0',
                p: 0.5,
              },
            }}
          >
            <Box sx={{ px: 2, py: 1 }}>
              <Typography variant="subtitle2" fontWeight={700} color="#0f172a">
                {user?.name}
              </Typography>
              <Typography variant="caption" color="#64748b">
                {user?.email}
              </Typography>
            </Box>
            <MenuItem onClick={handleProfileClick} sx={{ borderRadius: 2 }}>
              <ListItemIcon sx={{ color: '#64748b' }}>
                <PersonOutlineRoundedIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="My Profile" primaryTypographyProps={{ fontSize: '0.875rem' }} />
            </MenuItem>
            <MenuItem onClick={handleLogout} sx={{ borderRadius: 2, color: '#ef4444' }}>
              <ListItemIcon sx={{ color: '#ef4444' }}>
                <LogoutRoundedIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Logout" primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: 600 }} />
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
