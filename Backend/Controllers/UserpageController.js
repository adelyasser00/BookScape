var mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Book = mongoose.model('book'),
  jwt = require('jsonwebtoken');

//get all books in user.books

exports.get_all_books = async function (req, res) {
  try {
    const token = req.headers.authorization;
    console.log(token);
    const decoded = jwt.verify(token, "RESTFULAPIs");
    const userId = decoded._id;
    console.log(userId); // prints "1234567890"
    const u = await User.findById(userId);
    console.log(u);
    const user = await User.findById(userId).populate('books');

    if (!u) {
      return res.status(404).json({ message: `User not found` });
    }
    const bookIds = user.books.map((book) => book._id);
    const books = await Book.find({ _id: { $in: bookIds } });
    res.status(200).json({ message: 'Books added to user', books: books });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
//add books to user's books array

exports.addToBooks = async function (req, res) {
  try {
    console.log("request body: ", req.body);
    const token = req.headers.authorization;
    console.log(token);
    const decoded = jwt.verify(token, "RESTFULAPIs");
    console.log("token verified");
    const userId = decoded._id;
    console.log(userId); // prints "1234567890"
    const user = await User.findById({ _id: userId });
    if (!user) {
      return res.status(404).json({ message: `User with id ${userId} not found` });
    }
    else
    console.log("user found");
    const book = await Book.findById({ _id: new mongoose.Types.ObjectId( req.body.bookId) });
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    else
    console.log("book found");

    //if the book is not in the user's books add the book to the user's book array 
    if (!user.books.some((bookItem) => bookItem._id.toString() === book._id.toString())) {
      user.books.push(book);
      await user.save();
      res.status(200).json({ message: "Book added to user" });
    }
    else {
      res.status(400).json({ message: "Book already added to user" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
//remove book from user's book array
exports.removeFromBooks = async function (req, res) {
  try {
    const token = req.headers.authorization;
    console.log(token);
    const decoded = jwt.verify(token, "RESTFULAPIs");
    const userId = decoded._id;
    console.log(userId); // prints "1234567890"
    const user = await User.findById({ _id: userId });
    if (!user) {
      return res.status(404).json({ message: `User with id ${userId} not found` });
    }
    const book = await Book.findById({ _id: new mongoose.Types.ObjectId( req.body.bookId) });
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    if (user.books.some((bookItem) => bookItem._id.toString() === book._id.toString())) {
      const index = user.books.findIndex((bookItem) => bookItem._id.toString() === book._id.toString());
      user.books.splice(index, 1);
      await user.save();
      res.status(200).json({ message: "Book removed from user" });
    }
    else {
      res.status(400).json({ message: "Book not found" });
    }
  }
  catch (error) {
    res.status(500).json({ message: error.message });
  }
};