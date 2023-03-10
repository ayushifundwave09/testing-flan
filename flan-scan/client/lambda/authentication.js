const { authenticateToken } = require('./oidc-authenticator');

const verifyToken = async (token) => {
  const authorizedParties = ['dealflow-app', 'fundwave-openidconnectconsumerserver'];
  // const token = event.headers['authorization'] ?  event.headers['authorization'].split(' ')[1] : '';
  if (token) {
    return authenticateToken(token, authorizedParties)
  }
  else {
    return null;
  }
};

module.exports = {
  verifyToken
};