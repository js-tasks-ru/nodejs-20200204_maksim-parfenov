const mongoose = require('mongoose');
const connection = require('../libs/connection');


const productSchema = new mongoose.Schema({
  images: [String],
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectID,
    ref: 'Category',
    required: true,
  },
  subcategory: {
    type: mongoose.Schema.Types.ObjectID,
    ref: 'Category',
    required: true,
  },
});

module.exports = connection.model('Product', productSchema);
