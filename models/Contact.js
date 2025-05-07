// models/Contact.js

const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  phones: {
    type: [String],
    default: [],
  },
  avatar: {
    type: String,
    default: '',
  },
  email: {
    type: String,
    default: '',
  },
  company: {
    type: String,
    default: '',
  },
  trashed: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

const Contact = mongoose.model("Contact", contactSchema);

module.exports = Contact;
