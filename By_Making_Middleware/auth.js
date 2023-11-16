const jwksRsa = require('jwks-rsa');
const jwt = require('express-jwt')

const authConfig = {
    domain: 'dev-4isvnsq0aktbdnn0.us.auth0.com',
    audience: `This is Unique Identifier`,
};

const checkJwt = jwt({
    secret: jwksRsa.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `https://${authConfig.domain}/.well-known/jwks.json`,
    }),
    audience: authConfig.audience,
    issuer: `https://${authConfig.domain}/`,
    algorithms: ['RS256'],
});

module.exports = { checkJwt };
