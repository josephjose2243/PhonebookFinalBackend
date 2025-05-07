const Contact = require("../models/Contact");  // Use require to import the model

// Create new contact
const createContact = async (req, res) => {
  try {
    const { firstName, lastName, email, phoneNumbers, company } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !phoneNumbers || phoneNumbers.length === 0) {
      return res.status(400).json({
        success: false,
        message: "First name, last name, and at least one phone number are required.",
      });
    }

    const name = `${firstName} ${lastName}`;
    const phone = phoneNumbers[0].number;

    const newContact = new Contact({
      name,
      phone,
      avatar: '', 
      email: email || '', 
      company: company || '', 
    });

    await newContact.save();

    res.status(201).json({ success: true, data: newContact });
  } catch (error) {
    console.error("Error creating contact:", error.message);
    res.status(500).json({ success: false, message: "Failed to create contact" });
  }
}
// Get all contacts
const getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find();
    res.status(200).json({ success: true, data: contacts });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch contacts" });
  }
};

// Move contact to trash (soft delete)
const moveToTrash = async (req, res) => {
  try {
    const { id } = req.params;
    const contact = await Contact.findByIdAndUpdate(id, { trashed: true }, { new: true });

    if (!contact) {
      return res.status(404).json({ success: false, message: 'Contact not found' });
    }

    res.status(200).json({ success: true, message: 'Contact moved to trash', data: contact });
  } catch (error) {
    console.error('Error in moveToTrash:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get trashed contacts
const getTrashedContacts = async (req, res) => {
  try {
    const trashedContacts = await Contact.find({ trashed: true });
    if (!trashedContacts) {
      return res.status(404).json({ success: false, message: "No trashed contacts found" });
    }
    res.status(200).json({ success: true, data: trashedContacts });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to get trashed contacts", error });
  }
};

// Restore a trashed contact
const restoreContact = async (req, res) => {
  try {
    const { id } = req.params;
    const contact = await Contact.findByIdAndUpdate(id, { trashed: false }, { new: true });

    if (!contact) {
      return res.status(404).json({ success: false, message: 'Contact not found' });
    }

    res.status(200).json({ success: true, message: 'Contact restored successfully', data: contact });
  } catch (error) {
    console.error('Error in restoreContact:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Permanently delete a contact
const permanentlyDeleteContact = async (req, res) => {
  try {
    const { id } = req.params;
    const contact = await Contact.findOneAndDelete({ _id: id });

    if (!contact) {
      return res.status(404).json({ success: false, message: 'Contact not found' });
    }

    res.status(200).json({ success: true, message: 'Contact permanently deleted' });
  } catch (error) {
    console.error('Error in permanentlyDeleteContact:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get contact by ID
// Get contact by ID
const getContactById = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({ message: "Contact not found" });
    }
    res.json(contact);
  } catch (error) {
    console.error("Error fetching contact by ID:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update contact by ID
const updateContactById = async (req, res) => {
  try {
    const { name, company, email, phones } = req.body;

    const updatedContact = await Contact.findByIdAndUpdate(req.params.id, {
      name,
      company,
      email: email || '',  // Email is optional, defaulting to empty string if not provided
      phones: phones || [],  // Phones are optional, defaulting to an empty array if not provided
    }, { new: true });

    if (!updatedContact) {
      return res.status(404).json({ message: "Contact not found" });
    }

    res.json(updatedContact);
  } catch (error) {
    console.error("Error updating contact:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createContact,
  getAllContacts,
  moveToTrash,
  getTrashedContacts,
  restoreContact,
  permanentlyDeleteContact,
  getContactById,
  updateContactById
};
