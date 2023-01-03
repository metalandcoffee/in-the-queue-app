// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
/**
 * Spotify Callback Endpoint.
 */
import type { NextApiRequest, NextApiResponse } from 'next';
import { withApiAuthRequired } from '@auth0/nextjs-auth0';

// Must be user authenticated to access endpoint.
export default withApiAuthRequired(
	async (req: NextApiRequest, res: NextApiResponse) => {
		if (!process.env.SPOTIFY_CLIENT_ID) {
			return res.status(400).json({
				message: 'Missing Spotify Client ID.',
			});
		}

		const scope: string =
			'user-read-currently-playing user-read-recently-played';
		const state: string = generateRandomString(16);
		const paramsObj: LoginURLParams = {
			client_id: process.env.SPOTIFY_CLIENT_ID,
			response_type: 'code',
			redirect_uri: 'http://localhost:3000/api/callback',
			scope,
			state,
		};
		const params: string = new URLSearchParams(paramsObj).toString();
		res.redirect(`https://accounts.spotify.com/authorize?${params}`);
	}
);

/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
const generateRandomString = (length: number) => {
	let text: string = '';
	const possible: string =
		'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	for (let i = 0; i < length; i++) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	return text;
};
