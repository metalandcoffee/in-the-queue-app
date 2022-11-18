// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
/**
 * Update Endpoint.
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
		console.log(req.body);
		if (!req.body.id || !req.body.status) {
			return res.status(400).json({
				message: 'Application error. Please contact administrator.',
			});
		}

		console.log('🤘🏾');
		const client = await clientPromise;
		const db = client.db('metal-albums');

		try {
			await db
				.collection('albums')
				.updateOne(
					{ _id: new mongo.ObjectId(req.body.id) },
					{ $set: { status: req.body.status } }
				);
			return res.status(200).json({ message: 'Album updated.' });
		} catch (e) {
			console.log(e);
			return res
				.status(500)
				.json({ message: 'Database error. Try again later.' });
		}
	}
);
