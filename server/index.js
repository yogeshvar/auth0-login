const express = require('express');
const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');

const app = express();
const port = 4000;

const jwksUri = process.env.JWKS_URL;

const validateToken = async (req, res, next) => {
    const bearerToken = req.headers.authorization;
    const token = bearerToken.replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized - Token not provided' });
    }

    const client = jwksClient({
        jwksUri,
    });

    const getKey = (header, callback) => {
        client.getSigningKey(header.kid, (err, key) => {
            const signingKey = key.publicKey || key.rsaPublicKey;
            callback(null, signingKey);
        });
    };

    try {
        jwt.verify(token, getKey, {
            algorithms: ['RS256'],
        }, (err, decoded) => {
            if (err) {
                return res.status(401).json({ error: 'Unauthorized - Invalid token' });
            }
            req.user = decoded;
            req.user.isVerifiedByServer = true;

            res.cookie('idtoken', token, { httpOnly: true });
            next();
        });
    } catch (err) {
        console.log(err);
        return res.status(401).json({ error: 'Unauthorized - Invalid token' });
    }
};

app.get('/api/protected', validateToken, (req, res) => {
    const user = req.user;
    res.cookie('idtoken', req.idToken, { httpOnly: true });
    res.json({ message: 'This is a protected route', user });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
