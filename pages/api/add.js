// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
/**
 * Add Endpoint.
 */
import { withApiAuthRequired } from '@auth0/nextjs-auth0';
import clientPromise from '../../lib/mongodb';

export default withApiAuthRequired(async (req, res) => {
  // If artist name or album name is falsy...
  if (!req.body.name) {
    return res.status(400).json({ message: 'Must provide album name.' });
  }

  const client = await clientPromise;
  const db = client.db('metal-albums');

  // Fetch album artwork from Genius.
  const response = await fetch(`https://api.genius.com/search?q=${encodeURIComponent(req.body.name)}&access_token=${process.env.GENIUS_API_KEY}`);
  const data = await response.json();

  // Is message property is present, no available album artwork.
  const albumCover = data?.response?.hits[0]?.result?.header_image_thumbnail_url || false;

  // Add new album to database.
  const newAlbum = {
    name: data?.response?.hits[0]?.result?.primary_artist?.name ?? req.body.name,
    album: data?.response?.hits[0]?.result?.title ?? req.body.album,
    status: 'none',
    image: albumCover,
  };
  try {
    await db.collection('albums').insertOne(newAlbum);
    return res.status(200).json(newAlbum);
  } catch (e) {
    return res.status(500).json({ message: 'Database error. Try again later.' });
  }
});
