// External dependencies.
const express = require('express');
const MongoClient = require('mongodb').MongoClient;
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
    app.post('/albums', (req, res) => {
      console.log('send data');
      console.log(req.body);
      albumsCollection.findOneAndUpdate(
        { _id: 'Born' },
        {
          $set: {
            name: req.body.name,
            album: req.body.album
          }
        },
        {
          upsert: true
        }
      )
      .then(result => {
        console.log(result);
        res.json('Success');
      })
      .catch(error => console.error(error));
    });

    // Album Delete Endpoint.
    app.delete('/albums', (req, res) => {
      // Handle delete event here
      albumsCollection.deleteOne(
        { name: req.body.name }
      )
      .then(result => {
        if (result.deletedCount === 0) {
          return res.json('No albums to delete...');
        }
        res.json(`${req.body.name} has been successfully deleted.`);
      })
      .catch(error => console.error(error));
    })
  })
  .catch(error => console.error(error));