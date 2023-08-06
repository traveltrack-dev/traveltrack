const express = require('express');
const router = express.Router();
const url = require('url');
const argon2 = require('argon2');
const database = require('../database');

module.exports = app => {
    /*
        GET /register
        login page
    */
    router.get('/', async (req, res, next) => {
        req.session.destroy();
        res.render('register', {
            title: 'Register',
            message: {
                success: req.query.success || null,
                warning: req.query.warning || null,
                error: req.query.error || null,
            }
        });
    });

    /*
        POST /register
        registration form submission
    */
    router.post('/', async (req, res, next) => {
        if (!req.body.username || !req.body.password || !req.body.password_confirmation || !req.body.email) {
            res.redirect(url.format({
                pathname: '/register',
                query: {
                    'error': 'Please fill out all fields',
                    }
                })
            );
        } else if (req.body.password !== req.body.password_confirmation) {
            res.redirect(url.format({
                pathname: '/register',
                query: {
                    'error': 'Passwords do not match',
                    }
                })
            );
        } else {
            console.info(`registering user ${req.body.username}...`)
            const hash = await argon2.hash(req.body.password);
            const db = app.get('db');
            const userId = await database.userRegister(db.pool, req.body.username, req.body.email, hash);
            console.info(`registered user ${req.body.username} with id ${userId}`);
            res.redirect(url.format({
                pathname: '/login',
                query: {
                    'success': 'Registration successful, please login',
                    }
                })
            );
        }
    });

    return router;
};
