import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
} from '@mui/material';
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import { useLocation, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import Logo from '../common/Logo';

const DRAWER_WIDTH = 240;

export const Sidebar = ({ mobileOpen, onDrawerToggle }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAdmin, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Build menu items based on role
  const menuItems = [
    {
      text: 'Dashboard',
      icon: <DashboardRoundedIcon fontSize="small" />,
      path: '/dashboard',
    },
    {
      text: 'Complaints',
      icon: <AssignmentOutlinedIcon fontSize="small" />,
      path: '/complaints',
    },
  ];

  // Users is ONLY visible for Admin role
  if (isAdmin) {
    menuItems.push({
      text: 'Users',
      icon: <PeopleAltOutlinedIcon fontSize="small" />,
      path: '/users',
    });
  }

  menuItems.push({
    text: 'Profile',
    icon: <PersonOutlineOutlinedIcon fontSize="small" />,
    path: '/profile',
  });

  const drawerContent = (
    <Box
      sx={{
        height: '100%',
        bgcolor: '#0f172a',
        color: '#f8fafc',
        display: 'flex',
        flexDirection: 'column',
        px: 2,
        py: 2.5,
      }}
    >
      {/* Brand Header */}
      <Box sx={{ px: 1, py: 1.5, mb: 3 }}>
        <Logo size={32} textColor="#ffffff" />
      </Box>

      {/* Navigation Links */}
      <List sx={{ px: 0, py: 0, display: 'flex', flexDirection: 'column', gap: 1 }}>
        {menuItems.map((item) => {
          const isSelected =
            location.pathname === item.path ||
            (item.path === '/complaints' && location.pathname.startsWith('/complaints'));

          return (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                selected={isSelected}
                onClick={() => {
                  navigate(item.path);
                  if (mobileOpen && onDrawerToggle) {
                    onDrawerToggle();
                  }
                }}
                sx={{
                  borderRadius: 2.5,
                  py: 1.1,
                  px: 2,
                  color: isSelected ? '#ffffff' : '#94a3b8',
                  bgcolor: isSelected ? '#1d68f6 !important' : 'transparent',
                  transition: 'all 0.15s ease',
                  '&:hover': {
                    bgcolor: isSelected ? '#1d68f6' : 'rgba(255,255,255,0.06)',
                    color: '#ffffff',
                    '& .MuiListItemIcon-root': {
                      color: '#ffffff',
                    },
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 36,
                    color: isSelected ? '#ffffff' : '#94a3b8',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontSize: '0.9rem',
                    fontWeight: isSelected ? 700 : 500,
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}

        {/* Logout Item */}
        <ListItem disablePadding sx={{ mt: 0.5 }}>
          <ListItemButton
            onClick={handleLogout}
            sx={{
              borderRadius: 2.5,
              py: 1.1,
              px: 2,
              color: '#94a3b8',
              '&:hover': {
                bgcolor: 'rgba(239, 68, 68, 0.1)',
                color: '#ef4444',
                '& .MuiListItemIcon-root': {
                  color: '#ef4444',
                },
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 36, color: 'inherit' }}>
              <LogoutOutlinedIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText
              primary="Logout"
              primaryTypographyProps={{
                fontSize: '0.9rem',
                fontWeight: 500,
              }}
            />
          </ListItemButton>
        </ListItem>
      </List>

      <Box sx={{ flexGrow: 1 }} />
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { md: DRAWER_WIDTH }, flexShrink: { md: 0 } }}
    >
      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: DRAWER_WIDTH,
            border: 'none',
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Desktop permanent drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: DRAWER_WIDTH,
            border: 'none',
            height: '100vh',
            position: 'fixed',
          },
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </Box>
  );
};

export default Sidebar;
