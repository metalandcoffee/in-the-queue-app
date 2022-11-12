// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
/**
 * Add Endpoint.
 */
import type { NextApiRequest, NextApiResponse } from 'next';
import { withApiAuthRequired } from '@auth0/nextjs-auth0';
import clientPromise from '../../lib/mongodb';

// Types.
type LastFMResponse = {
  message: String,
  album: {
    image: {
      size: String,
      '#text': String
    }[],
  }
};

export default withApiAuthRequired(async (req: NextApiRequest, res: NextApiResponse) => {

  // If artist name or album name is falsy...
  if (!req.body.name || !req.body.album) {
    return res.status(400).json({ message: 'Must contain artist name and album name.' });
  }

  const client = await clientPromise;
  const db = client.db('metal-albums');

  // Fetch album artwork from Last.fm.
  const response = await fetch(`http://ws.audioscrobbler.com/2.0/?method=album.getinfo&artist=${encodeURIComponent(req.body.name)}&album=${encodeURIComponent(req.body.album)}&api_key=${process.env.LAST_FM_API_KEY}&format=json`);
  const data : LastFMResponse = await response.json();

  // Is message property is present, no available album artwork.
  const albumCover = data.message === undefined ? data.album.image[3]['#text'] : false;

  // Add new album to database.
  const newAlbum = {
    name: req.body.name,
    album: req.body.album,
    status: 'none',
    image: albumCover
  };
  try {
    await db.collection('albums').insertOne(newAlbum);
    return res.status(200).json(newAlbum);
  } catch (e) {
    return res.status(500).json({ message: 'Database error. Try again later.' });
  }
});
