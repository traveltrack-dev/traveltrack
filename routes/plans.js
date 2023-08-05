const express = require('express');
const router = express.Router();

/*
  GET /plans
  plans list page  
*/
router.get('/', function(req, res, next) {
  res.send(`plans go here for session ${req.session.id} (${req.session.user.username})`);
});

module.exports = router;
