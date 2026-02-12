const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_user.js").isValid;
let users = require("./auth_user.js").users;
const public_users = express.Router();

// Task 6: Register User
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;
  if (username && password) {
    if (!isValid(username)) {
      users.push({ "username": username, "password": password });
      return res.status(200).json({ message: "User registered successfully!" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  return res.status(404).json({ message: "Provide username and password" });
});
// Login User
public_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (username && password) {
    const user = users.find(
      (u) => u.username === username && u.password === password
    );

    if (user) {
      return res.status(200).json({ message: "User successfully logged in" });
    } else {
      return res.status(401).json({ message: "Invalid username or password" });
    }
  }

  return res.status(400).json({ message: "Provide username and password" });
});


// Task 1 & 10: Get all books using Async Callback
public_users.get('/', async function (req, res) {
  const getBooks = () => Promise.resolve(books);
  const bookList = await getBooks();
  res.send(JSON.stringify(bookList, null, 4));
});

// Task 2 & 11: Search by ISBN using Promises
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  new Promise((resolve, reject) => {
    if (books[isbn]) resolve(books[isbn]);
    else reject("Book not found");
  })
  .then(book => res.send(JSON.stringify(book, null, 4)))
  .catch(err => res.status(404).json({message: err}));
});

// Task 3 & 12: Search by Author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  const filtered = Object.values(books).filter(b => b.author === author);
  res.send(JSON.stringify(filtered, null, 4));
});

// Task 4 & 13: Search by Title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  const filtered = Object.values(books).filter(b => b.title === title);
  res.send(JSON.stringify(filtered, null, 4));
});

// Task 5: Get Reviews
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  res.send(JSON.stringify(books[isbn].reviews, null, 4));
});

module.exports.general = public_users;
