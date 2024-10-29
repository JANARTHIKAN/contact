import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import img1 from '../components/image/6.png';

const EditContact = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [contact, setContact] = useState({
    name: '',
    email: '',
    phone: '',
    description: '',
    image: null,
  });

  useEffect(() => {
    const fetchContact = async () => {
      const token = localStorage.getItem('authToken');
      try {
        const response = await axios.get(`http://localhost:5000/api/contacts/getcontact/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setContact({ ...response.data, image: null }); // Set fetched data without an image initially
      } catch (error) {
        console.error('Error fetching contact:', error);
      }
    };
    fetchContact();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setContact({ ...contact, image: files[0] });
    } else {
      setContact({ ...contact, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', contact.name);
    formData.append('email', contact.email);
    formData.append('phone', contact.phone);
    formData.append('description', contact.description);
  
    // Include the image file if present
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput.files.length > 0) {
      formData.append('profilePicture', fileInput.files[0]);
    }
  
    try {
      const token = localStorage.getItem('authToken');
      await axios.put(`http://localhost:5000/api/contacts/edit/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      navigate('/contacts');
    } catch (error) {
      console.error('Error updating contact:', error);
    }
  };
  
  
  return (
    <div style={styles.editContactContainer}>
      <div style={styles.overlay}></div>
      <h2 style={styles.title}>Edit Contact</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          name="name"
          placeholder="Enter contact name"
          value={contact.name}
          onChange={handleChange}
          required
          style={styles.input}
        />
        <input
          type="email"
          name="email"
          placeholder="Enter email"
          value={contact.email}
          onChange={handleChange}
          required
          style={styles.input}
        />
        <input
          type="tel"
          name="phone"
          placeholder="Enter phone number"
          value={contact.phone}
          onChange={handleChange}
          required
          style={styles.input}
        />
        <textarea
          name="description"
          placeholder="Description"
          value={contact.description}
          onChange={handleChange}
          style={styles.textarea}
        />
        <input
          type="file"
          name="image"
          onChange={handleChange}
          style={styles.fileInput}
          accept="image/*"
        />
        <button type="submit" style={styles.button}>Update Contact</button>
      </form>
    </div>
  );
};

// Inline styles
const styles = {
  editContactContainer: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    padding: '20px',
    backgroundImage: `url(${img1})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    color: '#fff',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1,
  },
  title: {
    fontSize: '2rem',
    marginBottom: '20px',
    color: '#f7f7f7',
    textShadow: '1px 1px 5px rgba(0, 0, 0, 0.5)',
    zIndex: 2,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.3)',
    width: '100%',
    maxWidth: '400px',
    zIndex: 2,
  },
  input: {
    width: '100%',
    padding: '12px',
    margin: '10px 0',
    borderRadius: '5px',
    border: '1px solid #ddd',
    backgroundColor: '#f7f7f7',
    fontSize: '1rem',
    outline: 'none',
    transition: '0.3s',
  },
  textarea: {
    width: '100%',
    padding: '12px',
    margin: '10px 0',
    borderRadius: '5px',
    border: '1px solid #ddd',
    backgroundColor: '#f7f7f7',
    fontSize: '1rem',
    minHeight: '80px',
    outline: 'none',
    transition: '0.3s',
  },
  fileInput: {
    width: '100%',
    margin: '10px 0',
    color: '#fff',
    fontSize: '1rem',
  },
  button: {
    width: '100%',
    padding: '12px',
    marginTop: '10px',
    backgroundColor: '#007BFF',
    color: '#fff',
    borderRadius: '5px',
    border: 'none',
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'background 0.3s',
    zIndex: 2,
  },
};

export default EditContact;
