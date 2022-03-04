import mongo from 'mongodb'

export let client
export const connect = async () => {
	return mongo.MongoClient.connect(process.env.DB_CONNECT).then(res => client = res);
}
