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
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  Chip,
  Grid,
  FormControlLabel,
  Switch,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
} from '@mui/icons-material';

const PermissionManagement = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedPermission, setSelectedPermission] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    module: '',
    isActive: true,
  });

  // Mock data - replace with actual API calls
  const permissions = [
    {
      id: 1,
      name: 'read_users',
      description: 'Can view user information',
      module: 'User Management',
      isActive: true,
      roles: ['Admin', 'Staff'],
    },
    {
      id: 2,
      name: 'write_users',
      description: 'Can modify user information',
      module: 'User Management',
      isActive: true,
      roles: ['Admin'],
    },
    {
      id: 3,
      name: 'delete_users',
      description: 'Can delete users',
      module: 'User Management',
      isActive: true,
      roles: ['Admin'],
    },
  ];

  const modules = [
    'User Management',
    'Role Management',
    'Permission Management',
    'Content Management',
    'Report Management',
  ];

  const handleOpenDialog = (permission = null) => {
    if (permission) {
      setSelectedPermission(permission);
      setFormData({
        name: permission.name,
        description: permission.description,
        module: permission.module,
        isActive: permission.isActive,
      });
    } else {
      setSelectedPermission(null);
      setFormData({
        name: '',
        description: '',
        module: '',
        isActive: true,
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedPermission(null);
  };

  const handleInputChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'isActive' ? checked : value,
    }));
  };

  const handleSubmit = () => {
    // Add API call here to save/update permission
    console.log('Form submitted:', formData);
    handleCloseDialog();
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5">Permission Management</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add New Permission
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Permission Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Module</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Assigned Roles</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {permissions.map((permission) => (
              <TableRow key={permission.id}>
                <TableCell>{permission.name}</TableCell>
                <TableCell>{permission.description}</TableCell>
                <TableCell>{permission.module}</TableCell>
                <TableCell>
                  <Chip
                    label={permission.isActive ? 'Active' : 'Inactive'}
                    color={permission.isActive ? 'success' : 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                    {permission.roles.map((role) => (
                      <Chip
                        key={role}
                        label={role}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                </TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => handleOpenDialog(permission)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton color="error">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedPermission ? 'Edit Permission' : 'Add New Permission'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
            <TextField
              name="name"
              label="Permission Name"
              value={formData.name}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              name="description"
              label="Description"
              value={formData.description}
              onChange={handleInputChange}
              fullWidth
              multiline
              rows={2}
            />
            <TextField
              name="module"
              label="Module"
              value={formData.module}
              onChange={handleInputChange}
              select
              fullWidth
              SelectProps={{
                native: true,
              }}
            >
              <option value="">Select Module</option>
              {modules.map((module) => (
                <option key={module} value={module}>
                  {module}
                </option>
              ))}
            </TextField>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.isActive}
                  onChange={handleInputChange}
                  name="isActive"
                />
              }
              label="Active"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {selectedPermission ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PermissionManagement; 