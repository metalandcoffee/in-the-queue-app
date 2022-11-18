// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
/**
 * Delete Endpoint.
 */
import type { NextApiRequest, NextApiResponse } from 'next';
import * as mongo from 'mongodb';
import { withApiAuthRequired } from '@auth0/nextjs-auth0';
import clientPromise from '../../lib/mongodb';

type Data = {
	message: string;
};

export default withApiAuthRequired(
	async (req: NextApiRequest, res: NextApiResponse<Data>) => {
		// If artist name or album name is falsy...
		if (!req.body.id) {
			return res.status(400).json({
				message: 'Application error. Please contact administrator.',
			});
		}

		const client = await clientPromise;
		const db = client.db('metal-albums');

		try {
			await db
				.collection('albums')
				.deleteOne({ _id: new mongo.ObjectId(req.body.id) });
			return res.status(200).json({ message: 'Album deleted.' });
		} catch (e) {
			return res
				.status(500)
				.json({ message: 'Database error. Try again later.' });
		}
	}
);
