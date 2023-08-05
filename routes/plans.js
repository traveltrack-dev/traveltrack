var express = require('express');
var router = express.Router();

/*
  GET /plans
  plans list page  
*/
router.get('/', function(req, res, next) {
  res.send('plans go here');
});

module.exports = router;
