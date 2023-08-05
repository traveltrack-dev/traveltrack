var express = require('express');
var router = express.Router();

/*
    GET /login
    login page
*/
router.get('/', async (req, res, next) => {
    res.send('login form page here');
});

/*
    POST /login
    login form submission
*/
router.post('/', async (req, res, next) => {
    console.log(req.body);
    if (req.body.username && req.body.password) {
        req.session.user = {
            username: req.body.username,
            password: req.body.password,
        };
        res.redirect('/plans');
    } else {
        res.json({
            'error': 'login failed, missing username or password',
        }, 400);
    }
});

module.exports = router;
