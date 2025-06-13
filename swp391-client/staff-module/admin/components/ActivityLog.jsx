import React, { useState } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Typography,
  TextField,
  Grid,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';
import {
  FilterList as FilterIcon,
  Visibility as ViewIcon,
} from '@mui/icons-material';

const ActivityLog = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openFilter, setOpenFilter] = useState(false);
  const [openDetails, setOpenDetails] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [filters, setFilters] = useState({
    user: '',
    action: '',
    module: '',
    dateFrom: '',
    dateTo: '',
  });

  // Mock data - replace with actual API calls
  const activities = [
    {
      id: 1,
      timestamp: '2024-03-15 10:30:45',
      user: 'admin@example.com',
      action: 'Create',
      module: 'User Management',
      details: 'Created new user: john_doe',
      ipAddress: '192.168.1.1',
      status: 'success',
    },
    {
      id: 2,
      timestamp: '2024-03-15 10:25:30',
      user: 'staff@example.com',
      action: 'Update',
      module: 'Role Management',
      details: 'Updated role permissions for Staff role',
      ipAddress: '192.168.1.2',
      status: 'success',
    },
    {
      id: 3,
      timestamp: '2024-03-15 10:20:15',
      user: 'admin@example.com',
      action: 'Delete',
      module: 'Permission Management',
      details: 'Deleted permission: manage_reports',
      ipAddress: '192.168.1.1',
      status: 'error',
    },
  ];

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenFilter = () => {
    setOpenFilter(true);
  };

  const handleCloseFilter = () => {
    setOpenFilter(false);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleApplyFilter = () => {
    // Add filter logic here
    console.log('Applied filters:', filters);
    handleCloseFilter();
  };

  const handleViewDetails = (activity) => {
    setSelectedActivity(activity);
    setOpenDetails(true);
  };

  const handleCloseDetails = () => {
    setOpenDetails(false);
    setSelectedActivity(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'success':
        return 'success';
      case 'error':
        return 'error';
      case 'warning':
        return 'warning';
      default:
        return 'default';
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5">Activity Log</Typography>
        <Button
          variant="outlined"
          startIcon={<FilterIcon />}
          onClick={handleOpenFilter}
        >
          Filter
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Timestamp</TableCell>
              <TableCell>User</TableCell>
              <TableCell>Action</TableCell>
              <TableCell>Module</TableCell>
              <TableCell>Details</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {activities
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((activity) => (
                <TableRow key={activity.id}>
                  <TableCell>{activity.timestamp}</TableCell>
                  <TableCell>{activity.user}</TableCell>
                  <TableCell>{activity.action}</TableCell>
                  <TableCell>{activity.module}</TableCell>
                  <TableCell>{activity.details}</TableCell>
                  <TableCell>
                    <Chip
                      label={activity.status}
                      color={getStatusColor(activity.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton
                      color="primary"
                      onClick={() => handleViewDetails(activity)}
                    >
                      <ViewIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={activities.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

      {/* Filter Dialog */}
      <Dialog open={openFilter} onClose={handleCloseFilter} maxWidth="sm" fullWidth>
        <DialogTitle>Filter Activities</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
            <TextField
              name="user"
              label="User"
              value={filters.user}
              onChange={handleFilterChange}
              fullWidth
            />
            <TextField
              name="action"
              label="Action"
              value={filters.action}
              onChange={handleFilterChange}
              fullWidth
            />
            <TextField
              name="module"
              label="Module"
              value={filters.module}
              onChange={handleFilterChange}
              fullWidth
            />
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  name="dateFrom"
                  label="Date From"
                  type="date"
                  value={filters.dateFrom}
                  onChange={handleFilterChange}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  name="dateTo"
                  label="Date To"
                  type="date"
                  value={filters.dateTo}
                  onChange={handleFilterChange}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseFilter}>Cancel</Button>
          <Button onClick={handleApplyFilter} variant="contained" color="primary">
            Apply Filters
          </Button>
        </DialogActions>
      </Dialog>

      {/* Activity Details Dialog */}
      <Dialog
        open={openDetails}
        onClose={handleCloseDetails}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Activity Details</DialogTitle>
        <DialogContent>
          {selectedActivity && (
            <Box sx={{ pt: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="subtitle2">Timestamp</Typography>
                  <Typography>{selectedActivity.timestamp}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2">User</Typography>
                  <Typography>{selectedActivity.user}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2">Action</Typography>
                  <Typography>{selectedActivity.action}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2">Module</Typography>
                  <Typography>{selectedActivity.module}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2">Details</Typography>
                  <Typography>{selectedActivity.details}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2">IP Address</Typography>
                  <Typography>{selectedActivity.ipAddress}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2">Status</Typography>
                  <Chip
                    label={selectedActivity.status}
                    color={getStatusColor(selectedActivity.status)}
                    size="small"
                  />
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDetails}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ActivityLog; 