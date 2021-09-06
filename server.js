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
const { use } = require('passport');
const app = express();

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
    const usersCollection = db.collection('users');

    app.use(express.static('public'));
    app.listen(process.env.PORT, function() {
        console.log(`listening on ${process.env.PORT}`);
    });

    initPassPort(passport,
      getUserByEmail,
      getUserById,
    );
    
    async function getUserByEmail(email) {
      return await usersCollection.findOne({ email });
    }

    async function getUserById(id) {
      return await usersCollection.findOne({ _id: ObjectId(id) });
    }
    
    // function getUserById() {
    //   usersCollection
    // }

    // Login Endpoint.
    app.get('/login', checkNotAuthenticated, function(req, res) {
      res.render('login.ejs');
    });

    app.post('/login', passport.authenticate('local',{
      successRedirect: '/',
      failureRedirect: 'login',
      failureFlash: true
    }));

    // Logout endpoint.
    app.post('/logout', function(req, res) {
      req.logOut();
      res.redirect('/login');
    });

    // Register Endpoint.
    app.get('/register', checkNotAuthenticated, function(req, res) {
      res.render('register.ejs');
    });

    app.post('/register', async function(req, res) {

      // Encrypt password.
      const hashedPassword = await bcrypt.hash(req.body.password, 10);

      // Add user to database.
      usersCollection.insertOne(
        {
          name: req.body.name,
          email: req.body.email,
          password: hashedPassword
        }
      )
      .then(result => {
        res.redirect('/login');
      })
      .catch(error => console.error(error));
    });

    // Home Endpoint.
    app.get('/', checkAuthenticated, async function(req, res) {
      const current = await albumsCollection.find({ status : 'none' }).toArray();
      const liked = await albumsCollection.find({ status : 'liked' }).toArray();
      const disliked = await albumsCollection.find({ status : 'disliked' }).toArray();

      console.log(current, liked, disliked);
      res.render('index.ejs', { albums: current, liked, disliked });
      // albumsCollection.find().toArray()
      //   .then(results => {
      //     res.render('index.ejs', { albums: results })
      //   })
      //   .catch(error => {
      //     console.error(error);
      //   });
    })

    // Album Add Endpoint.
    app.post('/add-album', (req, res) => {
      albumsCollection.insertOne(
        {
          name: req.body['name'],
          album: req.body['album'],
          status: 'none'
        }
      )
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

    // Album Post Endpoint.
    app.post('/albums', (req, res) => {
      console.log(req.body['album-id']);
      albumsCollection.updateOne(
        { _id: ObjectId(req.body['album-id']) },
        { $set: { status: req.body['status'] } }
      )
      .then(result => {
        console.log(result);
        // if (result.deletedCount === 0) {
        //   return res.json('No albums to like...');
        // }
        res.json(`Album status has been updated.`);
      })
      .catch(error => console.error(error));
    })
  })
  .catch(error => console.error(error));

  

// Auth functions.
function checkAuthenticated(req, res, next) {
  if ( req.isAuthenticated()) {
      return next();
  }

  res.redirect('/login');
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
      return res.redirect('/');
  }

  return next();
}