const express = require('express');
const { 
  createContact, 
  getAllContacts, 
  moveToTrash, 
  getTrashedContacts, 
  restoreContact, 
  permanentlyDeleteContact, 
  updateContactById, 
  getContactById 
} = require('../controllers/contactController');  // Use require to import controller functions

const router = express.Router();

// Define routes here
router.post('/', createContact);         // Create a new contact
router.get('/', getAllContacts);         // Get all contacts
router.put('/:id/trash', moveToTrash);   // Move contact to trash
router.get('/trash', getTrashedContacts); // Get trashed contacts
router.put('/:id/restore', restoreContact); // Restore a trashed contact
router.delete('/:id/delete', permanentlyDeleteContact); // Permanently delete

router.put('/:id', updateContactById); // Update contact
router.get('/:id', getContactById);   // Get contact by ID

module.exports = router;  // Use module.exports to export the router
