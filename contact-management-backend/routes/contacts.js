const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
const multer = require('multer');

// Set up Multer for storing image buffers
const storage = multer.memoryStorage(); // Store file in memory as buffer
const upload = multer({ storage });

const path = require('path');
const authenticate = require('../middleware/authMiddleware'); // Use the middleware


// Create a new contact
router.post('/addcontacts', authenticate, upload.single('profilePicture'), async (req, res) => {
  const { name, email, phone, description, userId } = req.body;
  const profilePicture = req.file ? req.file.buffer : null;

  const newContact = new Contact({ 
    name, 
    email, 
    phone, 
    description, 
    profilePicture, 
    userId: userId
  });

  try {
    const savedContact = await newContact.save();
    res.status(201).json(savedContact);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all contacts for the authenticated user
router.get('/:userId', authenticate, async (req, res) => {
  const { userId } = req.params; // Correct parameter access

  try {
    console.log(userId);

    // Fetch contacts from the database filtered by userId
    const contacts = await Contact.find({ userId });

    // Convert profile picture buffer to Base64 if exists
    const contactsWithBase64 = contacts.map(contact => {
      const profilePicture = contact.profilePicture
        ? `data:image/png;base64,${contact.profilePicture.toString('base64')}`
        : null;
      return { ...contact.toObject(), profilePicture };
    });

    // Send the modified contacts back to the client
    res.json(contactsWithBase64);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// Delete a contact by ID for the authenticated user
router.delete('/delete/:id', authenticate, async (req, res) => {
  const { id } = req.params;
 console.log(id);
  try {
    const deletedContact = await Contact.findOneAndDelete({ _id: id });
    if (!deletedContact) {
      return res.status(404).json({ message: 'Contact not found or unauthorized' });
    }
    res.status(200).json({ message: 'Contact deleted successfully', deletedContact });
  } catch (error) {
    console.error('Error deleting contact:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update a contact by ID
router.put('/edit/:id', authenticate, upload.single('profilePicture'), async (req, res) => {
  const { id } = req.params;

  try {
    // If a new profile picture is uploaded, update the profile picture field
    if (req.file) {
      req.body.profilePicture = req.file.buffer; // Store the buffer
    }

    // Update the contact
    const updatedContact = await Contact.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedContact) {
      return res.status(404).send('Contact not found');
    }

    // Convert profile picture to Base64 if it exists
    const updatedContactWithBase64 = {
      ...updatedContact.toObject(),
      profilePicture: updatedContact.profilePicture
        ? `data:image/png;base64,${updatedContact.profilePicture.toString('base64')}`
        : null,
    };

    // Send the modified contact back to the client
    res.status(200).json(updatedContactWithBase64);
  } catch (error) {
    console.error('Error updating contact:', error);
    res.status(500).json({ message: error.message });
  }
});



router.get('/getcontact/:id', authenticate, async (req, res) => {
  const { id } = req.params; // Extract the contact ID from the request parameters

  try {
    const contact = await Contact.findById(id); // Fetch the contact by ID
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' }); // Handle contact not found
    }

    res.status(200).json(contact); // Return the contact data
  } catch (error) {
    console.error('Error fetching contact:', error);
    res.status(500).json({ message: 'Server error', error: error.message }); // Handle server error
  }
});





// Update contact by ID for the authenticated user
/* router.put('/contacts/:id', authenticate, async (req, res) => {
  try {
    const contact = await Contact.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId }, // Ensure contact belongs to user
      req.body,
      { new: true }
    );
    if (!contact) {
      return res.status(404).send('Contact not found');
    }
    res.send(contact);
  } catch (error) {
    res.status(500).send('Error updating contact: ' + error.message);
  }
}); */

module.exports = router;
