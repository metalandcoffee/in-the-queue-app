/**
 * Required External Modules & App Variables
 */
import fetch from 'node-fetch'
import dateFns from 'date-fns'
import express from 'express'
import bcrypt from 'bcrypt'
import passport from 'passport'
import flash from 'express-flash'
import session from 'express-session'
import mongo from 'mongodb'
import dotenv from 'dotenv'

console.log(`metalandcoffee`);
/**
 * Internal dependencies
 */
import initPassPort from './passport-config.js'

// Pull in environmental constants.
dotenv.config();

console.log('test');
/**
 *  App Configuration
 */
const app = express(); // Start server.
app.set('view engine', 'ejs'); // Set template engine too EJS.

app.use(express.urlencoded({ extended: false })); // https://stackoverflow.com/questions/23259168/what-are-express-json-and-express-urlencoded
app.use(express.json());
app.use(express.static('public'));
app.listen(process.env.PORT, function () { // Start listening on selected port.
  console.log(`listening on ${process.env.PORT}`);
});
app.use(flash());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

mongo.MongoClient.connect(process.env.DB_CONNECT)
  .then(client => {
    console.log('Connected to Database');
    const db = client.db('metal-albums');
    const albumsCollection = db.collection('albums');
    const usersCollection = db.collection('users');



    initPassPort(passport,
      getUserByEmail,
      getUserById,
    );

    async function getUserByEmail(email) {
      return await usersCollection.findOne({ email });
    }

    async function getUserById(id) {
      return await usersCollection.findOne({ _id: mongo.ObjectId(id) });
    }

    // Login Endpoint.
    app.get('/login', checkNotAuthenticated, function (req, res) {
      res.render('login.ejs', { referer: req.headers.referer });
    });

    app.post('/login', passport.authenticate('local', {
      successRedirect: '/',
      failureRedirect: 'login',
      failureFlash: true
    }));

    // Logout endpoint.
    app.post('/logout', function (req, res) {
      req.logOut();
      res.redirect('/login');
    });

    // Register Endpoint.
    // app.get('/register', checkNotAuthenticated, function (req, res) {
    //   res.render('register.ejs');
    // });

    // app.post('/register', async function (req, res) {

    //   // Encrypt password.
    //   const hashedPassword = await bcrypt.hash(req.body.password, 10);

    //   // Add user to database.
    //   usersCollection.insertOne(
    //     {
    //       name: req.body.name,
    //       email: req.body.email,
    //       password: hashedPassword
    //     }
    //   )
    //     .then(result => {
    //       res.redirect('/login');
    //     })
    //     .catch(error => console.error(error));
    // });

    // Home Endpoint.
    //app.get('/', checkAuthenticated, async function(req, res) {
    app.get('/', async function (req, res) {
      const current = await albumsCollection.find(
        {
          status: 'none',
          is_archive: { "$exists": false }
        }
      )
        .toArray();
      const liked = await albumsCollection.find(
        {
          status: 'liked',
          is_archive: { "$exists": false }
        },
      )
        .toArray();
      const disliked = await albumsCollection.find(
        {
          status: 'disliked',
          is_archive: { "$exists": false }
        }
      )
        .toArray();

      const archive = await albumsCollection.find(
        {
          archive_date: { "$exists": true }
        },
        {
          projection: { _id: 0, archive_date: 1 }
        }
      )
        .toArray();
      const archiveDates = {};
      archive.map(album => {
        archiveDates[album.archive_date] = dateFns.format(album.archive_date, 'MMMM do, y');
      });
      res.render('index.ejs', { albums: current, liked, disliked, archiveDates });
    })

    // Album Add Endpoint.
    app.post('/add-album', async (req, res) => {

      const response = await fetch(`http://ws.audioscrobbler.com/2.0/?method=album.getinfo&artist=${encodeURIComponent(req.body['name'])}&album=${encodeURIComponent(req.body['album'])}&api_key=${process.env.LASTFM_API_KEY}&format=json`);
      const data = await response.json();
      let albumCover = '';
      // Album not found response: { message: 'Album not found', error: 6 }
      if (data.message === undefined) {
        console.log(data.album.image[1]['#text']);
        albumCover = data.album.image[1]['#text'];
      }

      albumsCollection.insertOne(
        {
          name: req.body['name'],
          album: req.body['album'],
          status: 'none',
          image: data.album.image[1]['#text']
        }
      )
        .then(result => {
          res.json(`Successfully added.`);
        })
        .catch(error => console.error(error));
    });

    // Album Update Endpoint.
    app.post('/update-album', (req, res) => {
      albumsCollection.updateOne(
        { _id: mongo.ObjectId(req.body['album-id']) },
        {
          $set: {
            "name": req.body['album-artist'],
            "album": req.body['album-name']
          }
        }
      )
        .then(result => {
          res.redirect('/');
        })
        .catch(error => console.error(error));
    });

    // Album Delete Endpoint.
    app.delete('/albums', (req, res) => {
      albumsCollection.deleteOne(
        { _id: mongo.ObjectId(req.body['album-id']) }
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
      albumsCollection.updateOne(
        { _id: mongo.ObjectId(req.body['album-id']) },
        { $set: { status: req.body['status'] } }
      )
        .then(result => {
          res.json(`Album status has been updated.`);
        })
        .catch(error => console.error(error));
    })

    // Archive Endpoint.
    app.get('/archive', async (req, res) => {
      try {
        const current = await albumsCollection.find(
          {
            status: 'none',
            archive_date: Number(req.query.date)
          }
        )
          .toArray();
        const liked = await albumsCollection.find(
          {
            status: 'liked',
            archive_date: Number(req.query.date)
          },
        )
          .toArray();
        const disliked = await albumsCollection.find(
          {
            status: 'disliked',
            archive_date: Number(req.query.date)
          }
        )
          .toArray();
        const archive = await albumsCollection.find(
          {
            archive_date: { "$exists": true }
          },
          {
            projection: { _id: 0, archive_date: 1 }
          }
        )
          .toArray();
        const archiveDates = {};
        archive.map(album => {
          archiveDates[album.archive_date] = dateFns.format(album.archive_date, 'MMMM do, y');
        });
        res.render('archive.ejs', { currentArchiveDate: req.query.date, archiveDate: dateFns.format(Number(req.query.date), 'MMMM do, y'), albums: current, liked, disliked, archiveDates });
      } catch (e) {
        console.log(e);
      }
    });

    app.post('/archive', async (req, res) => {
      try {
        const date = Date.now();
        const updates = await albumsCollection.updateMany(
          { is_archive: { "$exists": false } },
          {
            $set: {
              "is_archive": true,
              "archive_date": date
            }
          }
        );
        res.json(`Albums have been archived.`);
      } catch (e) {
        console.log(e);
      }
    });
  })
  .catch(error => console.error(error));

// Auth functions.
function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
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