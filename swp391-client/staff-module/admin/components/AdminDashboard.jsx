import React, { useState } from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Tabs,
  Tab,
  AppBar,
  Toolbar,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Security as SecurityIcon,
  Assignment as AssignmentIcon,
  Menu as MenuIcon,
  ExitToApp as LogoutIcon,
} from '@mui/icons-material';
import UserManagement from './admin-module/components/UserManagement';
import RoleManagement from './components/RoleManagement';
import PermissionManagement from './components/PermissionManagement';
import ActivityLog from './components/ActivityLog';

const AdminDashboard = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, index: 0 },
    { text: 'User Management', icon: <PeopleIcon />, index: 1 },
    { text: 'Role Management', icon: <SecurityIcon />, index: 2 },
    { text: 'Permission Management', icon: <AssignmentIcon />, index: 3 },
    { text: 'Activity Log', icon: <AssignmentIcon />, index: 4 },
  ];

  const renderContent = () => {
    switch (selectedTab) {
      case 0:
        return (
          <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
              Admin Dashboard
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6} lg={3}>
                <Paper sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="h6">Total Users</Typography>
                  <Typography variant="h4">1,234</Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} md={6} lg={3}>
                <Paper sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="h6">Active Roles</Typography>
                  <Typography variant="h4">8</Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} md={6} lg={3}>
                <Paper sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="h6">Permissions</Typography>
                  <Typography variant="h4">24</Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} md={6} lg={3}>
                <Paper sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="h6">Today's Activities</Typography>
                  <Typography variant="h4">156</Typography>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        );
      case 1:
        return <UserManagement />;
      case 2:
        return <RoleManagement />;
      case 3:
        return <PermissionManagement />;
      case 4:
        return <ActivityLog />;
      default:
        return null;
    }
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Admin Control Panel
          </Typography>
          <IconButton color="inherit">
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        sx={{
          width: 240,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 240,
            boxSizing: 'border-box',
            marginTop: '64px',
          },
        }}
      >
        <List>
          {menuItems.map((item) => (
            <ListItem
              button
              key={item.text}
              selected={selectedTab === item.index}
              onClick={() => setSelectedTab(item.index)}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: '100%',
          marginTop: '64px',
        }}
      >
        {renderContent()}
      </Box>
    </Box>
  );
};

export default AdminDashboard; 