/**
 * Define Router Endpoints.
 */

// External Dependencies.
import passport from 'passport';
import fetch from 'node-fetch';
import mongo from 'mongodb';

// Internal Dependencies.
import router from './router.js';
import { client } from '../mongo.client.js';
import {
  checkAuthenticated,
  checkNotAuthenticated,
  getCurrentListData,
  checkDbAccess,
} from '../helpers.js';

/**
 * Home Endpoint
 */
router.get('/', checkAuthenticated, async (req, res) => {
  const db = client.db('metal-albums').collection('albums');
  const {
    current,
    liked,
    disliked,
    archiveDates,
  } = await getCurrentListData(db);
  res.render('index.ejs', {
    albums: current, liked, disliked, archiveDates,
  });
});

/**
 * Read-Only Endpoint
 */
router.get('/read-only', async (req, res) => {
  const db = client.db('metal-albums').collection('albums');
  const {
    current,
    liked,
    disliked,
    archiveDates,
  } = await getCurrentListData(db);
  res.render('read-only.ejs', {
    albums: current, liked, disliked, archiveDates,
  });
});

/**
 * Login Endpoint
 */
router.get('/login', checkNotAuthenticated, (req, res) => {
  res.render('login.ejs', { referer: req.headers.referer });
});
router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: 'login',
  failureFlash: true,
}));

/**
 * Logout Endpoint
 */
router.post('/logout', (req, res) => {
  req.logOut();
  res.redirect('/login');
});

// Album Add Endpoint.
router.post('/add-album', checkDbAccess, async (req, res) => {
  const response = await fetch(`http://ws.audioscrobbler.com/2.0/?method=album.getinfo&artist=${encodeURIComponent(req.body.name)}&album=${encodeURIComponent(req.body.album)}&api_key=${process.env.LASTFM_API_KEY}&format=json`);
  const data = await response.json();
  let albumCover = '';
  if (data.message === undefined) {
    albumCover = data.album.image[3]['#text'];
  }
  // Large album size.
  console.log(data.album.image[3]);

  client.db('metal-albums').collection('albums').insertOne(
    {
      name: req.body.name,
      album: req.body.album,
      status: 'none',
      image: albumCover,
    },
  )
    .then(() => {
      res.json('Successfully added.');
    })
    .catch((error) => res.status(500).json(error));
});

// Album Update Endpoint.
router.post('/update-album', checkDbAccess, (req, res) => {
  client.db('metal-albums').collection('albums').updateOne(
    { _id: mongo.ObjectId(req.body['album-id']) },
    {
      $set: {
        name: req.body['album-artist'],
        album: req.body['album-name'],
      },
    },
  )
    .then(() => {
      res.redirect('/');
    })
    .catch((error) => console.error(error));
});

/**
 * Album Delete Endpoint
 */
router.delete('/delete-album', checkDbAccess, (req, res) => {
  client.db('metal-albums').collection('albums').deleteOne(
    { _id: mongo.ObjectId(req.body['album-id']) },
  )
    .then((result) => {
      if (result.deletedCount === 0) {
        return res.json('No albums to delete...');
      }
      return res.json('Successfully deleted.');
    })
    .catch((error) => res.status(500).json(error));
});

/**
 * Album Status Post Endpoint.
 */
router.post('/toggle-status', checkDbAccess, (req, res) => {
  client.db('metal-albums').collection('albums').updateOne(
    { _id: mongo.ObjectId(req.body['album-id']) },
    { $set: { status: req.body.status } },
  )
    .then(() => {
      res.json('Album status has been updated.');
    })
    .catch((error) => res.status(500).json(error));
});

/**
 * Archive Endpoint.
 */
router.get('/archive', async (req, res) => {
  try {
    const current = await client.db('metal-albums').collection('albums').find(
      {
        status: 'none',
        archive_date: Number(req.query.date),
      },
    )
      .toArray();
    const liked = await client.db('metal-albums').collection('albums').find(
      {
        status: 'liked',
        archive_date: Number(req.query.date),
      },
    )
      .toArray();
    const disliked = await client.db('metal-albums').collection('albums').find(
      {
        status: 'disliked',
        archive_date: Number(req.query.date),
      },
    )
      .toArray();
    const archive = await client.db('metal-albums').collection('albums').find(
      {
        archive_date: { $exists: true },
      },
      {
        projection: { _id: 0, archive_date: 1 },
      },
    )
      .toArray();
    const archiveDates = {};
    archive.map((album) => {
      archiveDates[album.archive_date] = dateFns.format(album.archive_date, 'MMMM do, y');
    });
    res.render('archive.ejs', {
      currentArchiveDate: req.query.date, archiveDate: dateFns.format(Number(req.query.date), 'MMMM do, y'), albums: current, liked, disliked, archiveDates,
    });
  } catch (e) {
    console.log(e);
  }
});

router.post('/archive', checkDbAccess, async (req, res) => {
  try {
    const date = Date.now();
    await client.db('metal-albums').collection('albums').updateMany(
      { is_archive: { $exists: false } },
      {
        $set: {
          is_archive: true,
          archive_date: date,
        },
      },
    );
    res.json('Albums have been archived.');
  } catch (e) {
    console.log(e);
  }
});

// Export module.
export default router;
