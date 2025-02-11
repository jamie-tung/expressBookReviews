const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
    const username = req.body.username;
    const password = req.body.password;
    if (!username || !password) {
        if (!username && !password) {
            return res.status(404).json({ message: "Username and password not entered." });
        } else if (!username) {
            return res.status(404).json({ message: "Username not entered." });
        } else {
            return res.status(404).json({ message: "Password not entered." });
        }
    }
    
    if (username && password) {
        if (!isValid(username)) {
            // Add the new user to the users array
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "Registration is successful. Now you can login"});
        } else {
            return res.status(404).json({message: "User with username already exists!"});
        }
    }
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    let myGetPromise = new Promise((resolve, reject) => {
        resolve(res.send(JSON.stringify({"books": books }, null, 4)));
    });

    myGetPromise.then(function() {
        console.log("Book results delivered to user");
    });
  
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    let getPromise = new Promise((resolve, reject) => {
        resolve(JSON.stringify(books[isbn]));
    }); 
    getPromise.then((successMessage) => {
        res.send(successMessage);
    });
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;
    let getPromise = new Promise((resolve, reject) => {
        let booksByAuthor = [];
        for(var isbn in books) {
            if (books[isbn].author == author) {
                let book = {"isbn":isbn, "title":books[isbn].title, "reviews":books[isbn].reviews};
                booksByAuthor.push(book);
            }
                
        }
        resolve(JSON.stringify({"booksbyauthor":booksByAuthor}));
    });
    getPromise.then((successMessage) => {
        res.send(successMessage);
    });
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    //Write your code here
    const title = req.params.title;
    let getPromise = new Promise((resolve, reject) => {
        let booksByTitle = [];
        for (var isbn in books) {
            if (books[isbn].title == title) {
                let book = {"isbn":isbn, "author":books[isbn].author, "reviews":books[isbn].reviews};
                booksByTitle.push(books[isbn]);
            }
        }
        resolve(JSON.stringify({"booksByTitle":booksByTitle}));
    });
    getPromise.then((successMessage) => {
        res.send(successMessage);
    });
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  res.send(JSON.stringify(books[isbn].reviews));
});

module.exports.general = public_users;
