const express = require('express');
const router = express.Router();
const url = require('url');

/*
    GET /login
    login page
*/
router.get('/', async (req, res, next) => {
    req.session.destroy();
    res.render('login', {
        title: 'Login',
        message: {
            success: req.query.success || null,
            warning: req.query.warning || null,
            error: req.query.error || null,
        }
    });
});

/*
    POST /login
    login form submission
*/
router.post('/', async (req, res, next) => {
    if (req.body.username && req.body.password) {
        req.session.user = {
            username: req.body.username,
            password: req.body.password,
        };
        res.redirect('/plans');
    } else {
        res.redirect(url.format({
            pathname: '/login',
            query: {
                'error': 'Please enter a username and password',
                }
            })
        );
    }
});

module.exports = router;
