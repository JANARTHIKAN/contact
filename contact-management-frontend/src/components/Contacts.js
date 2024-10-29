import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import './ContactStyles.css';

const Contacts = () => {
  const [contacts, setContacts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedContact, setExpandedContact] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const userId = localStorage.getItem('userId');
        const response = await axios.get(`http://localhost:5000/api/contacts/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setContacts(response.data);
      } catch (error) {
        console.error('Error fetching contacts:', error);
      }
    };
    fetchContacts();
  }, []);

  const toggleDetails = (contact) => {
    setExpandedContact(contact || null);
  };

  const handleEdit = (id) => {
    navigate(`/edit-contact/${id}`);
  };

  // Function to handle deletion
  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.delete(`http://localhost:5000/api/contacts/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Delete response:", response);
      setContacts(contacts.filter((contact) => contact._id !== id));
    } catch (error) {
      console.error('Error deleting contact:', error);
      console.error('Error details:', error.response);
    }
  };
  

  const filteredContacts = contacts.filter((contact) =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.phone.includes(searchTerm)
  );

  return (
    <div className="contacts-container">
      <div className="info">
        <h2>Contact List</h2>
        <Link to="/create-contact" className="create-contact-button">Create Contact</Link>
      </div>
      <input
        type="text"
        placeholder="Search by name or phone"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-bar"
      />

      {filteredContacts.length === 0 ? (
        <p>No contacts found</p>
      ) : (
        filteredContacts.map((contact) => (
          <div key={contact._id} className="contact-card">
            {contact.profilePicture ? (
              <img
                src={contact.profilePicture}
                alt="Profile"
                className="contact-image"
              />
            ) : (
              <div className="empty-image-circle"></div>
            )}
            <div className="contact-info">
              <h3>{contact.name}</h3>
              <p>{contact.phone}</p>
            </div>
            <div className="contact-actions">
              <FaEye
                className="action-icon view-icon"
                title="View"
                onClick={() => toggleDetails(contact)}
              />
              <FaEdit
                className="action-icon edit-icon"
                title="Edit"
                onClick={() => handleEdit(contact._id)}
              />
              <FaTrash
                className="action-icon delete-icon"
                title="Delete"
                onClick={() => handleDelete(contact._id)} // Call delete function here
              />
            </div>
          </div>
        ))
      )}

      {expandedContact && (
        <div className="modal">
          <div className="modal-content">
            <span className="close-button" onClick={() => toggleDetails(null)}>&times;</span>
            <h2 className="modal-title">Contact Details </h2>
            <div className="modal-body">
              <img src={expandedContact.profilePicture || 'default-image-path.jpg'} alt="Profile" className="contact-image-large" />
              <div className="modal-details">
                <p><span className="label">Name:</span> {expandedContact.name}</p>
                <p><span className="label">Phone:</span> {expandedContact.phone}</p>
                <p><span className="label">Email:</span> {expandedContact.email}</p>
                <p><span className="label">Description:</span> {expandedContact.description}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Contacts;
