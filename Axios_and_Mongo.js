const { MongoClient } = require('mongodb');
const axios = require('axios');

const mongoURI = 'mongodb://127.0.0.1:27017';

const auth0Domain = 'dev-4isvnsq0aktbdnn0.us.auth0.com';
const clientId = 'F9GRYC9WXDvYzfWCSbAlHLudxrHv0X4f';
const clientSecret = 'WMIIw4kNoEN_X8wbYYOt4ofux4y49zcopYAqSeuNg6QWq53CwbPa47oLHEfnylVL';

async function connectToMongoDB() {
    const client = new MongoClient(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

    try {
        await client.connect();
        console.log('Connected to MongoDB');
        return client.db(); 
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        return null;
    }
}

async function insertUserToMongoDB(db, user) {
    const usersCollection = db.collection('users');

    const existingUser = await usersCollection.findOne({ auth0UserId: user.auth0UserId });

    if (!existingUser) {
        await usersCollection.insertOne(user);
    }
}

async function fetchUsersFromAuth0() {
    try {
        const response = await axios.post(`https://${auth0Domain}/oauth/token`, {
            client_id: clientId,
            client_secret: clientSecret,
            audience: `https://${auth0Domain}/api/v2/`,
            grant_type: 'client_credentials',
        });

        const accessToken = response.data.access_token;

        const usersResponse = await axios.get(`https://${auth0Domain}/api/v2/users`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        return usersResponse.data;
    } catch (error) {
        console.error('Error fetching users from Auth0:', error);
        return null;
    }
}

async function migrateUsersToMongoDB() {
    const db = await connectToMongoDB();

    if (!db) {
        console.error('Could not connect to MongoDB. Users will not be migrated.');
        return;
    }

    const auth0Users = await fetchUsersFromAuth0();

    if (!auth0Users) {
        console.error('Could not fetch users from Auth0. Users will not be migrated.');
        return;
    }

    for (const auth0User of auth0Users) {
        const user = {
            auth0UserId: auth0User.user_id,
            email: auth0User.email,
            username: auth0User.username,
        };

        await insertUserToMongoDB(db, user);
    }

    await db.client.close();
    console.log('User Migration completed.');
}

migrateUsersToMongoDB();