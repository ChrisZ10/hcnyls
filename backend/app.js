const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Book = require('./models/book');
const User = require('./models/user');
const Request = require('./models/request');

mongoose.connect('mongodb://localhost/hcnyls', { useNewUrlParser: true })
.then(() => {
  console.log('database connected');
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS");
  next();
});

app.get('/api', function(req, res) {
  res.status(200).send({
    message: 'Hello World!'
  })
});

// search
app.get('/api/books', function(req, res) {
  Book.find({title: {$regex: req.query.keyword, $options: 'i'}}, function(err, docs) {
    if (err)
      console.log(err);
    else
      res.status(200).send(docs);
  });
});

// add book
app.post('/api/addbook', function(req, res) {
  const book = new Book({
    isbn: req.body.isbn,
    title: req.body.title,
    author: req.body.author,
    desc: req.body.desc,
    avail: req.body.avail,
    count: req.body.count
  });
  book.save().then(function(doc) {
    res.status(200).send(doc);
  });
});

// sign up
app.post('/api/signup', function(req, res) {
  const email = req.body.email;
  User.findOne({email: email}, function(err, result) {
    if (!result) {
      const user = new User({
        email: email,
        fname: req.body.fname,
        lname: req.body.lname,
        pwd: req.body.pwd,
        pickup: [],
        checkout: [],
        processing: []
      });
      user.save().then(function() {
        res.status(200).send({message: 'success', user: user});
      });
    } else {
      console.log('there is an existing account with the same email address');
      res.status(200).send({message: 'failure', user: undefined});
    }
  });
});

// log in
app.get('/api/login', function(req, res) {
  const email = req.query.email;
  const pwd = req.query.pwd;

  User.findOne({email: email}, function(err, result) {
    if (!result) {
      console.log('no match');
      res.status(200).send({case: 1, user: undefined});
    } else {
      if (result.pwd !== pwd) {
        console.log('wrong pwd');
        res.status(200).send({case: 2, user: undefined});
      } else {
        console.log('success');
        res.status(200).send({case: 3, user: result});
      }
    }
  });
});

// post request
app.post('/api/request', function(req, res) {

  User.updateOne(
    {email: req.body.user},
    {$push: {processing: {title: req.body.book, expire: 99999999}}},
    function(err, doc) {
      if (err)
        console.log(err);
    });

  const request = new Request({
    user: req.body.user,
    book: req.body.book,
    isProcessed: req.body.isProcessed,
    date: req.body.date
  });

  request.save().then(function() {
    res.status(200).send({message: 'request is sent successfully'});
  });

});

// retrieve all requests
app.get('/api/requests', function(req, res) {
  Request.find({}, function(err, docs) {
    if (err)
      console.log(err);
    else
      res.status(200).send(docs);
  });
});

// handle request
app.put('/api/request', function(req, res) {

  flag = false;
  if (!flag) {
    Book.updateOne({title: req.body.book}, {$inc: {count: -1}}, function(err, doc) {});
    Request.updateOne({user: req.body.user, book: req.body.book}, {$set: {isProcessed: true}}, function(err, doc) {});
  } else {
    res.status(200).send({message: 'request put on hold'});
    return;
  }
  Book.updateOne({title: req.body.book, count: 0}, {$set: {avail: false}}, function(err, doc) {
    flag = true;
  });

  // update user info

  // calculate an expiration date
  let date = req.body.date;
  let year = Math.floor(date / 10000);
  let month = Math.floor((date - year * 10000) / 100);
  let day = (date - year * 10000 - month * 100);
  day += 10; // pick up within 10 days
  if (month === 1 || month === 3 || month === 5 || month === 7 || month === 8 || month === 10 || month === 12) {
    month = month + Math.floor(day / 31);
    day = day % 31;
  } else if (month === 2) {
    month = month + Math.floor(day / 28);
    day = day % 28;
  } else {
    month = month + Math.floor(day / 30);
    day = day % 30;
  }
  year = year + Math.floor(month / 12);
  month = month % 12;
  date = year * 10000 + month * 100 + day;
  console.log(date);

  User.updateOne(
    {email: req.body.user},
    {$pull: {processing: {title: req.body.book}},
     $push: {pickup: {title: req.body.book, expire: date}}
    },
    function(err, doc) {}
  );

  res.status(200).send({message: 'request handled'});
});

module.exports = app;
