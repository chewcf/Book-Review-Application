const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
  let exist_users = users.filter((user) => user.username === username);
  if (exist_users.length > 0)
  {
    return false;
  }
  else
  {
    return true;
  }
}

const authenticatedUser = (username,password)=>{ //returns boolean
  //write code to check if username and password match the one we have in records.
  let exist_users = users.filter((user) => user.username === username && user.password === password);
  if (exist_users.length > 0)
  {
    return true;
  }
  else
  {
    return false;
  }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
  
  if (authenticatedUser(username, password))
  {
    let accessToken = jwt.sign({
      data: username
    }, 'access', { expiresIn: 60 * 60 });

    req.session.authorization = {
      accessToken
    }
    return res.status(200).json({message: "User successfully logged in"});
  }
  else
  {
    return res.status(400).json({message: "Incorrect username or password"});
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;
  const review = req.body.review;
  let username = req.username.data;

  books[isbn].reviews[username] = {"review":review};
  
  return res.status(200).json({message: "Update successfully"});
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;
  let username = req.username.data;

  if (isbn){
    delete books[isbn].reviews[username]
  }
  
  return res.status(200).json({message: "Delete successfully"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
