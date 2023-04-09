const jwt = require('jsonwebtoken');

function auth(req, res, next) {
  // get token from request headers
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).send({ message: 'Unauthorized' });
  }

  try {
    // verify token and extract payload
    const decoded = jwt.verify(token, 'RANDOM-TOKEN');
    req.user = decoded;
    next();
  } catch (err) {
    console.error(err);
    return res.status(401).send({ message: 'Unauthorized' });
  }
}

module.exports = auth;