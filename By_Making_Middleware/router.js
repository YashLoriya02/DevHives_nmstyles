const express = require('express');
const { checkJwt } = require('./auth.js');

const router = express.Router();

router.get('/user-data', checkJwt, (req, res) => {
  const { sub, email, nickname } = req.user;

  res.json({
    userId: sub,
    email
  });
});

module.exports = router;
