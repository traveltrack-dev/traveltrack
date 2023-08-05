const url = require('url');
var express = require('express');
var router = express.Router();

/* GET /logout */
router.get('/', async (req, res, next) => {
    req.session.destroy();
    res.redirect(url.format({
        pathname: '/login',
        query: {
          'success': 'You have been logged out',
        }
      })
    );
});

module.exports = router;
