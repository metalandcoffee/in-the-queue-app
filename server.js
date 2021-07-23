// External dependencies.
const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const app = express();

// Tell Express that we are using the EJS template engine.
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Pull in environmental constants.
require('dotenv').config();

MongoClient.connect(process.env.DB_CONNECT)
  .then(client => {
    console.log('Connected to Database');
    const db = client.db('metal-albums');
    const albumsCollection = db.collection('albums');

    app.use(express.static('public'));
    
    app.listen(3001, function() {
        console.log('listening on 3001');
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