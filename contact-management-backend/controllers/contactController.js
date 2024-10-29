// controllers/contactController.js
const Contact = require('../models/Contact');

const getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find();
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createContact = async (req, res) => {
  const { name, email, phone, description, profilePicture } = req.body;
  const contact = new Contact({ name, email, phone, description, profilePicture });

  try {
    const savedContact = await contact.save();
    res.status(201).json(savedContact);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { getContacts, createContact };
