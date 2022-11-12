// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
/**
 * Albums Endpoint.
 */
import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../lib/mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const client = await clientPromise;

  const db = client.db('metal-albums');

  const albums = await db.collection('albums').find({ is_archive: { $exists: false } }).toArray();
  res.status(200).json({ albums });
}
