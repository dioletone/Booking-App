import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { DataGrid } from '@mui/x-data-grid';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import '../../styles/HotelTable.css';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
const HotelTable = (onSelecte) => {
  const navigate = useNavigate();
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [selectedHotelId, setSelectedHotelId] = useState(null);
  const [confirmationText, setConfirmationText] = useState('');
  const [editHotel, setEditHotel] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    city: '',
    address: '',
    distance: '',
    photos: [''],
    title: '',
    desc: '',
    rating: '',
    facilities: [''],
    reviewsCount: '',
    cheapestPrice: '',
    featured: false,
  });
  const fetchHotels = async () => {
    try {
      const res = await axios.get('http://localhost:8800/api/hotels', { withCredentials: true });
      const hotelsWithId = res.data.map((hotel, index) => ({
        ...hotel,
        id: index + 1,
        roomsLength: hotel.rooms ? hotel.rooms.length : 0,
      }));
      setHotels(hotelsWithId);
    } catch (err) {
      setError(err.response ? err.response.data.message : err.message);
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    fetchHotels();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8800/api/hotels/${id}`, { withCredentials: true });
      setHotels(hotels.filter(hotel => hotel._id !== id));
      fetchHotels();
    } catch (err) {
      console.error('Error deleting hotel:', err);
    }
  };

  const handleOpenCheck = (id) => {
    setSelectedHotelId(id);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await handleDelete(selectedHotelId);
      setDeleteConfirmOpen(false);
      setSelectedHotelId(null);
    } catch (err) {
      console.error('Error deleting hotel:', err);
    }
  };

  const handleCancelDelete = () => {
    setDeleteConfirmOpen(false);
    setSelectedHotelId(null);
  };

  const handleOpenEdit = (hotel) => {
    setEditHotel(hotel);
    setFormData({
      name: hotel.name || '',
      type: hotel.type || '',
      city: hotel.city || '',
      address: hotel.address || '',
      distance: hotel.distance || '',
      photos: Array.isArray(hotel.photos) ? hotel.photos : [''],
      title: hotel.title || '',
      desc: hotel.desc || '',
      rating: hotel.rating || '',
      facilities: Array.isArray(hotel.facilities) ? hotel.facilities : [''],
      reviewsCount: hotel.reviewsCount || '',
      cheapestPrice: hotel.cheapestPrice || '',
      featured: hotel.featured || false,
    });
    setEditDialogOpen(true);
  };

  const handleEditChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleEditChangeArray = (field, index, value) => {
    const updatedArray = [...formData[field]];
    updatedArray[index] = value;
    setFormData({ ...formData, [field]: updatedArray });
  };
  
  const handleAddInput = (field) => {
    setFormData({ ...formData, [field]: [...formData[field], ''] });
  };

  const handleEditSubmit = async () => {
    console.log(formData)
    try {
      const updatedHotel = {
        ...formData,
       
      };

      await axios.put(`http://localhost:8800/api/hotels/${editHotel._id}`, updatedHotel, { withCredentials: true });
      setHotels(hotels.map(hotel => hotel._id === editHotel._id ? { ...hotel, ...updatedHotel } : hotel));
      setEditDialogOpen(false);
      setEditHotel(null);
      fetchHotels();
    } catch (err) {
      console.error('Error updating hotel:', err);
    }
  };
  const handleAddChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleAddSubmit = async () => {
    try {
      await axios.post('http://localhost:8800/api/hotels', formData, { withCredentials: true });
      fetchHotels();
      setAddDialogOpen(false);
    } catch (err) {
      console.error('Error adding hotel:', err);
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
    { field: 'name', headerName: 'Name', width: 150 },
    { field: 'type', headerName: 'Type', width: 150 },
    { field: 'city', headerName: 'City', width: 150 },
    { field: 'address', headerName: 'Address', width: 150 },
    { field: 'distance', headerName: 'Distance', width: 100 },
    {
      field: 'roomsLength', 
      headerName: 'Rooms', 
      width: 100,
      renderCell: (params) => (
        <Link to={`/admin/hotel-rooms/${params.row._id}`} onClick={()=> onSelecte("room")}>
          View Rooms
        </Link>
      )
    },

    {
      field: 'photos',
      headerName: 'Photos',
      width: 200,
      renderCell: (params) => (
        <div>
          {params.value.join(', ')}
        </div>
      )
    },
    { field: 'title', headerName: 'Title', width: 150 },
    { field: 'desc', headerName: 'Description', width: 200 },
    { field: 'rating', headerName: 'Rating', width: 100 },
   
    {
      field: 'facilities',
      headerName: 'Facilities',
      width: 150,
      renderCell: (params) => (
        <div>
          {params.value.join(', ')}
        </div>
      )
    },
    { field: 'reviewsCount', headerName: 'Reviews Count', width: 150 },
    { field: 'cheapestPrice', headerName: 'Price', width: 100 },
    { field: 'featured', headerName: 'Featured', width: 100 },
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
      )
    },
    
   
  ];

  return (
    <div className="datatable">
      <div className="datatableTitle">
        Hotels
      
        <Button onClick={() => setAddDialogOpen(true)} className="link">
    Add New
  </Button>
      </div>
      <DataGrid

        rows={hotels}
        columns={columns}
        getRowId={(row) => row._id}
        pageSize={5}
        rowsPerPageOptions={[5]}
        
      />
      {deleteConfirmOpen && (
        <div className="deleteConfirmCard">
          <p>Are you sure you want to delete this hotel?</p>
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
  <DialogTitle>Edit Hotel</DialogTitle>
  <DialogContent>
    <TextField
      margin="dense"
      label="Name"
      name="name"
      value={formData.name}
      onChange={handleEditChange}
      fullWidth
    />
    <TextField
      margin="dense"
      label="Type"
      name="type"
      value={formData.type}
      onChange={handleEditChange}
      fullWidth
    />
    <TextField
      margin="dense"
      label="City"
      name="city"
      value={formData.city}
      onChange={handleEditChange}
      fullWidth
    />
    <TextField
      margin="dense"
      label="Address"
      name="address"
      value={formData.address}
      onChange={handleEditChange}
      fullWidth
    />
    <TextField
      margin="dense"
      label="Distance"
      name="distance"
      value={formData.distance}
      onChange={handleEditChange}
      fullWidth
    />
    <DialogTitle>Photos</DialogTitle>
    {formData.photos && formData.photos.map((photo, index) => (
      <TextField
        key={index}
        margin="dense"
        label={`Photo ${index + 1}`}
        value={photo}
        onChange={(e) => handleEditChangeArray('photos', index, e.target.value)}
        fullWidth
      />
    ))}
    <Button onClick={() => handleAddInput('photos')} color="primary">
      Add Photo
    </Button>
    <DialogTitle>Facilities</DialogTitle>
    {formData.facilities.map((facility, index) => (
      <TextField
        key={index}
        margin="dense"
        label={`Facility ${index + 1}`}
        value={facility}
        onChange={(e) => handleEditChangeArray('facilities', index, e.target.value)}
        fullWidth
      />
    ))}
    <Button onClick={() => handleAddInput('facilities')} color="primary">
      Add Facility
    </Button>
    <TextField
      margin="dense"
      label="Title"
      name="title"
      value={formData.title}
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
    <TextField
      margin="dense"
      label="Rating"
      name="rating"
      value={formData.rating}
      onChange={handleEditChange}
      fullWidth
    />
   
    <TextField
      margin="dense"
      label="Reviews Count"
      name="reviewsCount"
      value={formData.reviewsCount}
      onChange={handleEditChange}
      fullWidth
    />
    <TextField
      margin="dense"
      label="Cheapest Price"
      name="cheapestPrice"
      value={formData.cheapestPrice}
      onChange={handleEditChange}
      fullWidth
    />
    <TextField
      margin="dense"
      label="Featured"
      name="featured"
      value={formData.featured}
      onChange={handleEditChange}
      fullWidth
    />
  </DialogContent>
  <DialogActions>
  <Button onClick={handleEditSubmit} color="primary">
      Save
    </Button>
    <Button onClick={() => setEditDialogOpen(false)} color="primary">
      Cancel
    </Button>
   
  </DialogActions>
</Dialog>
<Dialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)}>
  <DialogTitle>Add New Hotel</DialogTitle>
  <DialogContent>
    <TextField
      margin="dense"
      label="Name"
      name="name"
      value={formData.name}
      onChange={handleAddChange}
      fullWidth
    />
    <TextField
      margin="dense"
      label="Type"
      name="type"
      value={formData.type}
      onChange={handleAddChange}
      fullWidth
    />
    <TextField
      margin="dense"
      label="City"
      name="city"
      value={formData.city}
      onChange={handleAddChange}
      fullWidth
    />
    <TextField
      margin="dense"
      label="Address"
      name="address"
      value={formData.address}
      onChange={handleAddChange}
      fullWidth
    />
    <TextField
      margin="dense"
      label="Distance"
      name="distance"
      value={formData.distance}
      onChange={handleAddChange}
      fullWidth
    />
    {formData.photos.map((photo, index) => (
      <TextField
        key={index}
        margin="dense"
        label={`Photo ${index + 1}`}
        name={`photo${index}`}
        value={photo}
        onChange={(e) => {
          const newPhotos = [...formData.photos];
          newPhotos[index] = e.target.value;
          setFormData({ ...formData, photos: newPhotos });
        }}
        fullWidth
      />
    ))}
     <Button onClick={() => handleAddInput('photos')} color="primary">
      Add Photo
    </Button>
    
    <TextField
      margin="dense"
      label="Title"
      name="title"
      value={formData.title}
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
 
  
    {formData.facilities.map((facility, index) => (
      <TextField
        key={index}
        margin="dense"
        label={`Facility ${index + 1}`}
        name={`facility${index}`}
        value={facility}
        onChange={(e) => {
          const newFacilities = [...formData.facilities];
          newFacilities[index] = e.target.value;
          setFormData({ ...formData, facilities: newFacilities });
        }}
        fullWidth
      />
    ))} <Button onClick={() => handleAddInput('facilities')} color="primary">
    Add Facility
  </Button>
   
  </DialogContent>
  <DialogActions>
  <Button onClick={handleAddSubmit} color="primary">
      Save
    </Button>
    <Button onClick={() => setAddDialogOpen(false)} color="primary">
      Cancel
    </Button>
   
  </DialogActions>
</Dialog>
    </div>
  );
};

export default HotelTable;