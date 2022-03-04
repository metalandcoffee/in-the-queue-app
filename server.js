/**
 * Required External Modules
 */
import fetch from 'node-fetch'
import express from 'express'
import bcrypt from 'bcrypt'
import passport from 'passport'
import flash from 'express-flash'
import session from 'express-session'
import dotenv from 'dotenv'
import mongo from 'mongodb'

/**
 * Internal dependencies
 */
import { client, connect } from './mongo.client.js'
import initPassPort from './passport-config.js'
import router from './router/index.js'

// Pull in environmental constants.
dotenv.config();

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
app.use(router);


/**
 * DB Connection
 */
await connect();
console.log('Connected to Database');

initPassPort(passport,
  getUserByEmail,
  getUserById,
);

async function getUserByEmail(email) {
  return await client.db('metal-albums').collection('users').findOne({ email });
}

async function getUserById(id) {
  return await client.db('metal-albums').collection('users').findOne({ _id: mongo.ObjectId(id) });
}
