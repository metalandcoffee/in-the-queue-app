// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
/**
 * Delete Endpoint.
 */
import mongo from 'mongodb';
import { withApiAuthRequired } from '@auth0/nextjs-auth0';
import clientPromise from '../../lib/mongodb';

export default withApiAuthRequired(async (req, res) => {
  // If artist name or album name is falsy...
  if (!req.body.id) {
    return res.status(400).json({ message: 'Application error. Please contact administrator.' });
  }

  const client = await clientPromise;
  const db = client.db('metal-albums');

  try {
    await db.collection('albums').deleteOne({ _id: mongo.ObjectId(req.body.id) });
    return res.status(200).json();
  } catch (e) {
    return res.status(500).json({ message: 'Database error. Try again later.' });
  }
});
