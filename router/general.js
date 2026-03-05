const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require("axios");

// Register a new user
public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (isValid(username)) {
      users.push({ username: username, password: password });
      return res
        .status(200)
        .json({ message: "User successfully registered. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  return res.status(404).json({ message: "Unable to register user." });
});

// ============================================================
// Task 1: Get the book list available in the shop
// ============================================================
public_users.get("/", (req, res) => {
  return res.status(200).json(books);
});

// ============================================================
// Task 10: Get all books – Using async/await with Axios
// ============================================================
public_users.get("/async/books", async (req, res) => {
  try {
    const url = `${req.protocol}://${req.get("host")}/`;
    const response = await axios.get(url);
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching books", error: error.message });
  }
});

// ============================================================
// Task 2: Get book details based on ISBN
// ============================================================
public_users.get("/isbn/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).json(books[isbn]);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

// ============================================================
// Task 11: Get book details based on ISBN – Using Promises
// ============================================================
public_users.get("/async/isbn/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const url = `${req.protocol}://${req.get("host")}/isbn/${isbn}`;

  axios
    .get(url)
    .then((response) => {
      return res.status(200).json(response.data);
    })
    .catch((error) => {
      return res.status(500).json({ message: "Error fetching book by ISBN", error: error.message });
    });
});

// ============================================================
// Task 3: Get book details based on Author
// ============================================================
public_users.get("/author/:author", (req, res) => {
  const author = req.params.author.toLowerCase();
  const matchingBooks = [];

  const bookKeys = Object.keys(books);
  for (let key of bookKeys) {
    if (books[key].author.toLowerCase() === author) {
      matchingBooks.push({ isbn: key, ...books[key] });
    }
  }

  if (matchingBooks.length > 0) {
    return res.status(200).json(matchingBooks);
  } else {
    return res.status(404).json({ message: "No books found by this author" });
  }
});

// ============================================================
// Task 12: Get book details based on Author – Using async/await
// ============================================================
public_users.get("/async/author/:author", async (req, res) => {
  try {
    const author = req.params.author;
    const url = `${req.protocol}://${req.get("host")}/author/${encodeURIComponent(author)}`;
    const response = await axios.get(url);
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching books by author", error: error.message });
  }
});

// ============================================================
// Task 4: Get all books based on Title
// ============================================================
public_users.get("/title/:title", (req, res) => {
  const title = req.params.title.toLowerCase();
  const matchingBooks = [];

  const bookKeys = Object.keys(books);
  for (let key of bookKeys) {
    if (books[key].title.toLowerCase() === title) {
      matchingBooks.push({ isbn: key, ...books[key] });
    }
  }

  if (matchingBooks.length > 0) {
    return res.status(200).json(matchingBooks);
  } else {
    return res.status(404).json({ message: "No books found with this title" });
  }
});

// ============================================================
// Task 13: Get book details based on Title – Using Promises
// ============================================================
public_users.get("/async/title/:title", (req, res) => {
  const title = req.params.title;
  const url = `${req.protocol}://${req.get("host")}/title/${encodeURIComponent(title)}`;

  axios
    .get(url)
    .then((response) => {
      return res.status(200).json(response.data);
    })
    .catch((error) => {
      return res.status(500).json({ message: "Error fetching books by title", error: error.message });
    });
});

// ============================================================
// Task 5: Get book review based on ISBN
// ============================================================
public_users.get("/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).json(books[isbn].reviews);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

module.exports.general = public_users;
