// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
/**
 * Update Endpoint.
 */
import mongo from 'mongodb';
import clientPromise from '../../lib/mongodb';

export default async function handler(req, res) {
  // If artist name or album name is falsy...
  if (!req.body.id || !req.body.status) {
    return res.status(400).json({ message: 'Application error. Please contact administrator.' });
  }

  const client = await clientPromise;
  const db = client.db('metal-albums');

  try {
    await db.collection('albums').updateOne({ _id: mongo.ObjectId(req.body.id) },
      { $set: { status: req.body.status } });
    return res.status(200).json();
  } catch (e) {
    return res.status(500).json({ message: 'Database error. Try again later.' });
  }
}
