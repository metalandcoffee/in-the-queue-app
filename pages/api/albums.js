// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
/**
 * Albums Endpoint.
 */
import clientPromise from '../../lib/mongodb';

export default async function handler(req, res)  {
  const client = await clientPromise;

  const db = client.db('metal-albums');

  const albums = await db.collection('albums').find({ is_archive: { $exists: false } }).toArray();
  res.status(200).json({ albums });
}
