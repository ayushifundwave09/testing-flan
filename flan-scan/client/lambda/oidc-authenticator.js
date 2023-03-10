var jwksClient = require('jwks-rsa');
const jwt = require('jsonwebtoken');

let client = jwksClient({
    jwksUri:
        "https://id.fundwave.com" +
        '/auth/realms/' +
        "sandbox" +
        '/protocol/openid-connect/certs',
});

const getKey = function (header, callback) {
    try {
        client.getSigningKey(header.kid, function (err, key) {
            if (err) {
                console.log(err);
                return callback(err);
            }
            var signingKey = key.publicKey || key.rsaPublicKey;
            callback(null, signingKey);
        });
    } catch (e) {
        console.log(e);
        callback(e);
    }
};
const authenticateToken = function (token, authorizedParties) {
    let verificationOptions = {};

    return new Promise((resolve, reject) => {
        jwt.verify(token, getKey, verificationOptions, async function (err, data) {
            if (err) {
                console.log(err);
                reject(new Error(401));
            } else {
                if (!authorizedParties.includes(data.azp)) reject(new Error(401));
                resolve(data);
            }
        });
    });
};

module.exports = {
    authenticateToken,
};