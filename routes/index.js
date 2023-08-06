const express = require('express');
const router = express.Router();

/*
  GET /
  home page
*/
router.get('/', function(req, res, next) {
  if (req.session.user) {
    res.redirect('/plans');
  } else {
    res.redirect('/login');  
  }
});

module.exports = router;
