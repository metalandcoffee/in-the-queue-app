// Pull in environmental constants.
require('dotenv').config();

// External dependencies.
const express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');
const initPassPort = require('./passport-config');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const app = express();

initPassPort(passport,
  email => users.find(user => user.email === email),
  id => users.find(user => user.id === id),
);

// Tmp.
const users = [];

// Tell Express that we are using the EJS template engine.
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(flash());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());



MongoClient.connect(process.env.DB_CONNECT)
  .then(client => {
    console.log('Connected to Database');
    const db = client.db('metal-albums');
    const albumsCollection = db.collection('albums');

    app.use(express.static('public'));
    
    app.listen(3001, function() {
        console.log('listening on 3001');
    });

    // Login Endpoint.
    app.get('/login', function(req, res) {
      res.render('login.ejs');
    });

    app.post('/login', passport.authenticate('local',{
      successRedirect: '/',
      failureRedirect: 'login',
      failureFlash: true
    }));

    // Register Endpoint.
    app.get('/register', function(req, res) {
      res.render('register.ejs');
    });

    app.post('/register', async function(req, res) {
      try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        users.push({
            id: Date.now().toString(),
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        });
        console.log(users);
        res.redirect('/login');
      } catch {
        console.log('error');
        res.redirect('/register');
      }
      
    });

    // Album Read Endpoint.
    app.get('/', function(req, res) {
      albumsCollection.find().toArray()
        .then(results => {
          res.render('index.ejs', { albums: results })
        })
        .catch(error => {
          console.error(error);
        });
    })

    // Album Add Endpoint.
    app.post('/add-album', (req, res) => {
      console.log('send data');
      albumsCollection.insertOne(req.body)
      .then(result => {
        res.redirect('/');
      })
      .catch(error => console.error(error));
    });

    // Album Update Endpoint.
    app.post('/update-album', (req, res) => {
      console.log(req.body);
      albumsCollection.updateOne(
        { _id: ObjectId(req.body['album-id']) },
        { $set: { 
          "name" : req.body['album-artist'],
          "album": req.body['album-name']
        } }
      )
      .then(result => {
        res.redirect('/');
      })
      .catch(error => console.error(error));
    });

    // Album Delete Endpoint.
    app.delete('/albums', (req, res) => {
      console.log(req.body['album-id']);
      albumsCollection.deleteOne(
        { _id: ObjectId(req.body['album-id']) }
      )
      .then(result => {
        if (result.deletedCount === 0) {
          return res.json('No albums to delete...');
        }
        res.json(`Successfully deleted.`);
      })
      .catch(error => console.error(error));
    })
  })
  .catch(error => console.error(error));