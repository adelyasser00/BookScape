const mongoose = require('mongoose')

const Schema = mongoose.Schema

const bookSchema = new Schema({
  cover: {
    type: String,
    trim: true,
     required: true
  },
  name: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    required: true
  },
  author_id: {
    type:Schema.Types.ObjectId
  },
  brief: {
    type: String
  },

    reviews: [{
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    user_name: {
      type: String
    },
    body: {
      type: String,
      required: true
    },
    date: {
      type: Date,
      default: Date.now
    }
  }]
})

mongoose.model('book', bookSchema);
const Book = mongoose.model('Book', bookSchema);

module.exports = Book;