var axios = require("axios");

const auth0Domain = 'dev-4isvnsq0aktbdnn0.us.auth0.com';
const clientId = 'F9GRYC9WXDvYzfWCSbAlHLudxrHv0X4f';
const clientSecret = 'WMIIw4kNoEN_X8wbYYOt4ofux4y49zcopYAqSeuNg6QWq53CwbPa47oLHEfnylVL';

async function fetchUsersFromAuth0() {
    try {
        const response = await axios.post(`https://${auth0Domain}/oauth/token`, {
            client_id: clientId,
            client_secret: clientSecret,
            audience: `https://${auth0Domain}/api/v2/`,
            grant_type: 'client_credentials',
        });

        const accessToken = response.data.access_token;
        console.log(accessToken)
        return accessToken;
    } catch (error) {
        console.error('Error fetching users from Auth0:', error);
        return null;
    }
}

async function getUsersByEmail() {
    const token = await fetchUsersFromAuth0();

    if (!token) {
        console.error('Invalid token. Cannot make the request.');
        return;
    }

    var options = {
        method: 'GET',
        url: 'https://dev-4isvnsq0aktbdnn0.us.auth0.com/api/v2/users',
        params: { q: 'email:solutionsbydevhive@gmail.com' }, 
        headers: { Authorization: `Bearer ${token}` }
    };

    try {
        const response = await axios.request(options);
        console.log(response.data);
    } catch (error) {
        console.error(error.response.data);
    }
}

getUsersByEmail();
