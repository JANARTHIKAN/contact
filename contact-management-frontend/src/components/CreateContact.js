import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ContactStyles.css'; // Import your CSS styles

const CreateContact = () => {
  const [contact, setContact] = useState({
    name: '',
    email: '',
    phone: '',
    description: '',
    profilePicture: null,
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'profilePicture') {
      setContact({ ...contact, profilePicture: files[0] });
    } else {
      setContact({ ...contact, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    const userId = localStorage.getItem('userId'); // Retrieve userId from localStorage
    formData.append('userId', userId); // Include userId in the request
    formData.append('name', contact.name);
    formData.append('email', contact.email);
    formData.append('phone', contact.phone);
    formData.append('description', contact.description);
    if (contact.profilePicture) {
      formData.append('profilePicture', contact.profilePicture);
    }

    try {
      const token = localStorage.getItem('authToken'); // Retrieve token from localStorage
      const response = await axios.post('http://localhost:5000/api/contacts/addcontacts', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`, // Add token to Authorization header
        },
      });

      navigate('/contacts'); // Navigate back to contacts list
    } catch (error) {
      console.error('Error creating contact:', error);
    }
  };

  
  return (
    <div className="create-contact-container">
      <h2>Create Contact</h2>
      <form onSubmit={handleSubmit} className="create-contact-form">
        <input
          type="text"
          name="name"
          placeholder="Enter contact name"
          value={contact.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Enter email"
          value={contact.email}
          onChange={handleChange}
          required
        />
        <input
          type="tel"
          name="phone"
          placeholder="Enter phone number"
          value={contact.phone}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={contact.description}
          onChange={handleChange}
        />
        <input
          type="file"
          name="profilePicture"
          accept="image/*"
          onChange={handleChange}
        />
        <button type="submit">Save Contact</button>
      </form>
    </div>
  );
};

export default CreateContact;
