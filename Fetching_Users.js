const axios = require('axios');

async function getAuth0UserData() {
    const auth0Domain = 'dev-4isvnsq0aktbdnn0.us.auth0.com';
    const clientId = 'F9GRYC9WXDvYzfWCSbAlHLudxrHv0X4f';
    const clientSecret = 'WMIIw4kNoEN_X8wbYYOt4ofux4y49zcopYAqSeuNg6QWq53CwbPa47oLHEfnylVL';
    const audience = `https://${AUTH0_DOMAIN}/api/v2/`;

    const response = await axios.post(
        `https://${auth0Domain}/oauth/token`,
        {
            grant_type: 'client_credentials',
            audience,
        },
        {
            auth: {
                username: clientId,
                password: clientSecret,
            },
        }
    );
    const accessToken = response.data.access_token;
    console.log(accessToken)

    try {
        const response = await axios.get(`https://${auth0Domain}/api/v2/users`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        const userData = response.data;
        return userData;
    } catch (error) {
        console.log('Error retrieving user data:', error.message);
        throw error;
    }
}

getAuth0UserData()
    .then(userData => {
        console.log('Retrieved user data:', userData);
    })
    .catch(error => {
        console.error('Error:', error);
    });
