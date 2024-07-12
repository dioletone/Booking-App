import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { DataGrid } from '@mui/x-data-grid';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import '../../styles/UserDataTable.css';
import Switch from '@mui/material/Switch';
import UserCard from '../UserCard/UserCard';
const UserDataTable = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [confirmationText, setConfirmationText] = useState('');
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null); // State for selected user
  const [userCardOpen, setUserCardOpen] = useState(false); 
  const [formData, setFormData] = useState({
    fname: '',
    lname: '',
    username: '',
    email: '',
    password: "12345",
    phone: '',
    status: 'disabled'
  });
  const [formErrors, setFormErrors] = useState({
    username: '',
    email: ''
  });

  const fetchUsers = async () => {
    try {
      const res = await axios.get('http://localhost:8800/api/users', { withCredentials: true });
      const usersWithId = res.data.map((user, index) => ({
        ...user,
        fullname: user.fname + ' ' + user.lname,
        id: index + 1,
      }));
      setUsers(usersWithId);
    } catch (err) {
      setError(err.response ? err.response.data.message : err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleOpenCheck = (id) => {
    setSelectedUserId(id);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:8800/api/users/${selectedUserId}`, { withCredentials: true });
      setUsers(users.filter(user => user.id !== selectedUserId));
      setDeleteConfirmOpen(false);
      setSelectedUserId(null);
      fetchUsers();
    } catch (err) {
      console.error('Error deleting user:', err);
    }
  };

  const handleCancelDelete = () => {
    setDeleteConfirmOpen(false);
    setSelectedUserId(null);
  };

  const handleStatusChange = async (id, currentStatus) => {
    const newStatus = currentStatus === "active" ? "disabled" : "active";
    try {
      await axios.put(`http://localhost:8800/api/users/${id}`, { status: newStatus }, { withCredentials: true });
      setUsers(users.map(user => user.id === id ? { ...user, status: newStatus } : user));
      fetchUsers();
    } catch (err) {
      console.error('Error updating user status:', err);
    }
  };

  const handleAddChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddSubmit = async () => {
    let valid = true;
    let errors = { username: '', email: '' };

    if (!formData.username) {
      errors.username = 'Username cannot be empty';
      valid = false;
    }
    if (!formData.email) {
      errors.email = 'Email cannot be empty';
      valid = false;
    }

    setFormErrors(errors);

    if (valid) {
      try {
        await axios.post('http://localhost:8800/api/auth/register', formData, { withCredentials: true });
        setAddDialogOpen(false);
        setFormData({
          fname: '',
    lname: '',
    username: '',
    email: '',
    password: "12345",
    phone: '',
    status: 'disabled'
        });
        fetchUsers();
      } catch (err) {
        console.error('Error adding user:', err);
      }
    }
  };
  const handleOpenCard = (user) => {
    setSelectedUser(user);
    setUserCardOpen(true);
  };

  const handleCloseCard = () => {
    setSelectedUser(null);
    setUserCardOpen(false);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'username', headerName: 'Username', width: 150 },
    { field: 'fullname', headerName: 'Fullname', width: 150 },
    { field: 'email', headerName: 'Email', width: 200 },
    { field: 'phone', headerName: 'Phone Number', width: 150 },
    {
      field: 'status',
      headerName: 'Status',
      width: 150,
      renderCell: (params) => (
        <div>
          <span className={`cellWithStatus ${params.value.toLowerCase()}`}>
            {params.value}
          </span>
          <Switch
            checked={params.value === 'active'}
            onChange={() => handleStatusChange(params.row._id, params.value)}
          />
        </div>
      )
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params) => (
        <div className="cellAction">
          <button
            onClick={() => handleOpenCard(params.row)}
            className="viewButton"
          >
            View
          </button>
          <button
            onClick={() => handleOpenCheck(params.row._id)}
            className="deleteButton"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="datatable">
      <div className="datatableTitle">
        Users
        <Button onClick={() => setAddDialogOpen(true)} className="link">
          Add New
        </Button>
      </div>
      <DataGrid
        rows={users}
        columns={columns}
        getRowId={(row) => row.id}
        pageSize={5}
        rowsPerPageOptions={[5]}
      />
      {deleteConfirmOpen && (
        <div className="deleteConfirmCard">
          <p>Are you sure you want to delete this user?</p>
          <input
            type="text"
            value={confirmationText}
            onChange={(e) => setConfirmationText(e.target.value)}
            placeholder="Type 'yes' to confirm"
          />
          <button
            disabled={confirmationText.toLowerCase() !== 'yes'}
            className={confirmationText.toLowerCase() === 'yes' ? 'enabled' : ''}
            onClick={handleConfirmDelete}
          >
            Confirm
          </button>
          <button onClick={handleCancelDelete}>Cancel</button>
        </div>
      )}
      <Dialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)}>
        <DialogTitle>Add New User</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="First Name"
            name="fname"
            value={formData.fname}
            onChange={handleAddChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Last Name"
            name="lname"
            value={formData.lname}
            onChange={handleAddChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Username"
            name="username"
            value={formData.username}
            onChange={handleAddChange}
            error={!!formErrors.username}
            helperText={formErrors.username}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleAddChange}
            error={!!formErrors.email}
            helperText={formErrors.email}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Phone"
            name="phone"
            value={formData.phone}
            onChange={handleAddChange}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleAddSubmit} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
      {selectedUser && (
        <UserCard user={selectedUser} onClose={handleCloseCard} />
      )}
    </div>
  );
};

export default UserDataTable;