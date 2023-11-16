const express = require('express');
const axios = require('axios');

const app = express();
const PORT = 3000;

const auth0Domain = 'dev-4isvnsq0aktbdnn0.us.auth0.com';
const auth0ClientId = 'F9GRYC9WXDvYzfWCSbAlHLudxrHv0X4f';
const auth0ClientSecret = 'WMIIw4kNoEN_X8wbYYOt4ofux4y49zcopYAqSeuNg6QWq53CwbPa47oLHEfnylVL';

app.use(express.json());

let accessToken;

async function refreshAccessToken() {
    try {
        const { data } = await axios.post(`https://${auth0Domain}/oauth/token`, {
            grant_type: 'client_credentials',
            client_id: auth0ClientId,
            client_secret: auth0ClientSecret,
            audience: `https://${auth0Domain}/api/v2/`,
        });

        accessToken = data.access_token;
    } catch (error) {
        console.error('Error refreshing access token:', error.message);
        throw error;
    }
}

app.use(async (req, res, next) => {
    if (!accessToken) {
        await refreshAccessToken();
    }

    next();
});


app.get('/users', async (req, res) => {
    const email = "solutionsbydevhive@gmail.com";

    try {
        
        const { data: userResponse } = await axios.get(
            `https://${auth0Domain}/api/v2/users-by-email?email=${email}`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );

        const user = userResponse[0]; 

        res.json(user);
    } catch (error) {
        console.error(error);

        if (error.response && error.response.status === 401 && error.response.data.error === 'Unauthorized') {
            await refreshAccessToken();
            try {
                const { data: userResponse } = await axios.get(
                    `https://${auth0Domain}/api/v2/users-by-email?email=${email}`,
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    }
                );

                const user = userResponse[0];
                res.json(user);
            } catch (error) {
                console.error('Error fetching user after token refresh:', error);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        } else {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on Port ${PORT}`);
});
