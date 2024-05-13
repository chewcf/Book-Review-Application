const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  if(!username) { return res.status(400).json({message: "username not provided"}); }
  const password = req.body.password;
  if(!password) { return res.status(400).json({message: "password not provided"}); }
  const isValidUsername = isValid(username);
  if (isValidUsername)
  {
    users.push({"username":username,"password":password});
    return res.status(200).json({message: "The user" + (' ')+ (username) + " Has been added!"});
  }
  else
  {
    return res.status(400).json({message: "username already exists"});
  }
});

let myBookPromise = new Promise((resolve,reject) => {
    resolve(books);
})

const myBookisbn = (isbn) => {
  return new Promise((resolve,reject) => {
    resolve(books[isbn]);
})}

const myBookAuthor = (author) => {
  return new Promise((resolve,reject) => {
    resolve(Object.values(books).filter((book) => book.author === author));
})}

const myBookTitle = (title) => {
  return new Promise((resolve,reject) => {
    resolve(Object.values(books).filter((book) => book.title === title));
})}

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  myBookPromise.then((rtnbooks) => {
    return res.status(200).json(rtnbooks);
  })
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  myBookisbn(isbn).then((rtnbooks) => {
    return res.status(200).json(rtnbooks);
 })
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author;
  myBookAuthor(author).then((rtnbooks) => {
    return res.status(200).json(rtnbooks);
 })
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title;
  myBookTitle(title).then((rtnbooks) => {
    return res.status(200).json(rtnbooks);
 })
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  return res.status(200).json(books[isbn].reviews);
});

module.exports.general = public_users;
