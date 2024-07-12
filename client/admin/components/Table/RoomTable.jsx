import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { DataGrid } from '@mui/x-data-grid';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, CircularProgress } from '@mui/material';
import { useParams } from 'react-router-dom';
import RoomCard from '../RoomCard/RoomCard';
import "../../styles/RoomTable.css"
const RoomTable = () => {
  const { hotelId } = useParams();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [selectedRoomId, setSelectedRoomId] = useState(null);
  const [confirmationText, setConfirmationText] = useState('');
  const [editRoom, setEditRoom] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [roomCardOpen, setRoomCardOpen] = useState(false); // State for RoomCard

  const initialFormData = {
    number: '',
    title: '',
    price: '',
    maxPeople: '',
    desc: '',
    roomNumbers: [{ number: '' }],
    photos: [''],
    facilities: [''],
  };

  

  const [formData, setFormData] = useState(initialFormData);

  const [selectedRoom, setSelectedRoom] = useState(null);

const handleOpenRoomCard = (room) => {
  setSelectedRoom(room);
  setRoomCardOpen(true);
};

  const fetchRooms = async () => {
    try {
      const res = await axios.get(`http://localhost:8800/api/rooms/hotel/${hotelId}`, { withCredentials: true });
      const roomsWithId = res.data.map((room, index) => ({
        ...room,
        id: index + 1,
      }));
      setRooms(roomsWithId);
    } catch (err) {
      setError(err.response ? err.response.data.message : err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, [hotelId]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8800/api/rooms/${id}/${hotelId}`, { withCredentials: true });
      setRooms(rooms.filter(room => room._id !== id));
      fetchRooms();
    } catch (err) {
      console.error('Error deleting room:', err);
    }
  };

  const handleOpenCheck = (id) => {
    setSelectedRoomId(id);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await handleDelete(selectedRoomId);
      setDeleteConfirmOpen(false);
      setSelectedRoomId(null);
    } catch (err) {
      console.error('Error deleting room:', err);
    }
  };

  const handleAddInput = (field) => {
    setFormData({ ...formData, [field]: [...formData[field], ''] });
  };

  const handleCancelDelete = () => {
    setDeleteConfirmOpen(false);
    setSelectedRoomId(null);
  };

  const handleOpenEdit = (room) => {
    setEditRoom(room);
    setFormData({
      number: room.number || '',
      title: room.title || '',
      price: room.price || '',
      maxPeople: room.maxPeople || '',
      desc: room.desc || '',
      roomNumbers: room.roomNumbers,
      photos: room.photos || [''],
      facilities: room.facilities || [''],
    });
    setEditDialogOpen(true);
  };

  const handleEditChangeArray = (field, index, value) => {
    const updatedArray = [...formData[field]];
    updatedArray[index] = value;
    setFormData({ ...formData, [field]: updatedArray });
  };
  const handleEditChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async () => {
    try {
      await axios.put(`http://localhost:8800/api/rooms/${editRoom._id}`, formData, { withCredentials: true });
      setRooms(rooms.map(room => room._id === editRoom._id ? { ...room, ...formData } : room));
      setEditDialogOpen(false);
      setEditRoom(null);
      fetchRooms();
    } catch (err) {
      console.error('Error updating room:', err);
    }
  };

  const handleAddChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDeleteRoomNumber = (field, index) => {
    const updatedArray = [...formData[field]];
    updatedArray.splice(index, 1);
    setFormData({ ...formData, [field]: updatedArray });
  };

  const handleAddSubmit = async () => {
    try {
      await axios.post(`http://localhost:8800/api/rooms/${hotelId}`, { ...formData, hotelId }, { withCredentials: true });
      fetchRooms();
      setFormData(initialFormData);
      setAddDialogOpen(false);
    } catch (err) {
      console.error('Error adding room:', err);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'title', headerName: 'Room Type', width: 150 },
    { field: 'price', headerName: 'Price', width: 100 },
    { field: 'maxPeople', headerName: 'Max People', width: 150 },
    { field: 'desc', headerName: 'Description', width: 200 },
    {
      field: 'roomNumbers',
      headerName: 'Room Numbers',
      width: 200,
      renderCell: (params) => (
        <div className='roomNumber' onClick={() => handleOpenRoomCard(params.row)}>
          {params.value.map((room) => room.number).join(', ')}
        </div>
      ),
    },
    {
      field: 'capacityCheck',
      headerName: 'Capacity Check',
      width: 150,
      renderCell: (params) => (
        <div>
          {params.value ? 'Available' : 'Full'}
        </div>
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 200,
      renderCell: (params) => (
        <div className="cellAction">
          <button
            variant="contained"
            color="primary"
            onClick={() => handleOpenEdit(params.row)}
            className="viewButton"
          >
            Update
          </button>
          <button
            variant="contained"
            color="secondary"
            onClick={() => handleOpenCheck(params.row._id)}
            className="deleteButton"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];
  const handleOpenAddDialog = () => {
    setFormData(initialFormData);
    setAddDialogOpen(true);
  };
  
  // Use this handler in the button that opens the "Add New Room" dialog
  <Button onClick={handleOpenAddDialog} className="link">
    Add New
  </Button>

  return (
    <div className="datatable">
      <div className="datatableTitle">
        Rooms
        <Button onClick={() => handleOpenAddDialog() } className="link">
          Add New
        </Button>
      </div>
      <DataGrid
        rows={rooms}
        columns={columns}
        getRowId={(row) => row._id}
        pageSize={5}
        rowsPerPageOptions={[5]}
      />
      {deleteConfirmOpen && (
        <div className="deleteConfirmCard">
          <p>Are you sure you want to delete this room?</p>
          <input
            type="text"
            value={confirmationText}
            onChange={(e) => setConfirmationText(e.target.value)}
            placeholder="Type 'yes' to confirm"
          />
          <Button
            disabled={confirmationText.toLowerCase() !== 'yes'}
            className={confirmationText.toLowerCase() === 'yes' ? 'enabled' : ''}
            onClick={handleConfirmDelete}
          >
            Confirm
          </Button>
          <Button onClick={handleCancelDelete}>Cancel</Button>
        </div>
      )}
 <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
  <DialogTitle>Edit Room</DialogTitle>
  <DialogContent>
    {formData.roomNumbers && formData.roomNumbers.map((room, index) => (
      <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
        <TextField
          margin="dense"
          label={`Room Number ${index + 1}`}
          value={room.number}
          onChange={(e) => handleEditChangeArray('roomNumbers', index, { ...room, number: e.target.value })}
          fullWidth
        />
        <Button onClick={() => handleDeleteRoomNumber('roomNumbers', index)} color="secondary">
          Delete
        </Button>
      </div>
    ))}
    <Button onClick={() => handleAddInput('roomNumbers')} color="primary">
      Add Room Number
    </Button>
    <TextField
      margin="dense"
      label="Room Type"
      name="title"
      value={formData.title}
      onChange={handleEditChange}
      fullWidth
    />
    <TextField
      margin="dense"
      label="Price"
      name="price"
      value={formData.price}
      onChange={handleEditChange}
      fullWidth
    />
    <TextField
      margin="dense"
      label="Max People"
      name="maxPeople"
      value={formData.maxPeople}
      onChange={handleEditChange}
      fullWidth
    />
    <TextField
      margin="dense"
      label="Description"
      name="desc"
      value={formData.desc}
      onChange={handleEditChange}
      fullWidth
    />
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setEditDialogOpen(false)} color="primary">
      Cancel
    </Button>
    <Button onClick={handleEditSubmit} color="primary">
      Save
    </Button>
  </DialogActions>
</Dialog>
<Dialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)}>
  <DialogTitle>Add New Room</DialogTitle>
  <DialogContent>
    {formData.roomNumbers.map((room, index) => (
      <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
        <TextField
          margin="dense"
          label={`Room Number ${index + 1}`}
          value={room.number}
          onChange={(e) => handleEditChangeArray('roomNumbers', index, { ...room, number: e.target.value })}
          fullWidth
        />
        <Button onClick={() => handleDeleteRoomNumber('roomNumbers', index)} color="secondary">
          Delete
        </Button>
      </div>
    ))}
    <Button onClick={() => handleAddInput('roomNumbers')} color="primary">
      Add Room Number
    </Button>
    <TextField
      margin="dense"
      label="Room Type"
      name="title"
      value={formData.title}
      onChange={handleAddChange}
      fullWidth
    />
    <TextField
      margin="dense"
      label="Price"
      name="price"
      value={formData.price}
      onChange={handleAddChange}
      fullWidth
    />
    <TextField
      margin="dense"
      label="Max People"
      name="maxPeople"
      value={formData.maxPeople}
      onChange={handleAddChange}
      fullWidth
    />
    <TextField
      margin="dense"
      label="Description"
      name="desc"
      value={formData.desc}
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
{roomCardOpen && <RoomCard room={selectedRoom} onClose={()=>setRoomCardOpen(false)}/>}
    </div>
  );
}

export default RoomTable;