import { MongoClient, Db } from 'mongodb';

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGO_DB_Name;

//These store the database connection, allowing the connection to cache upon each function run.
let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

export async function connectToDatabase() {
    //If already connected, return cached connection
    if (cachedClient && cachedDb) {
        return cachedDb;
    } //if

    if (!uri) {
        throw new Error('The MONGODB_URI needs to be added to the .env.local file');
    }

    //else, create a new client using the previously defined uri
    const client = new MongoClient(uri);

    try {
        //Attempt MongoDB connection
        await client.connect();

        //Get database's name
        const db = client.db(dbName);

        //Save for later use
        cachedClient = client;
        cachedDb = db;

        console.log('MongoDB connection established');
        return db;
    } //try
    catch (error) {
        console.error('There was en error when trying to connect to the database:', error);
        throw new Error('Database connection failed');
    } //catch

} //connectToDatabase