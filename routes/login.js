const express = require('express');
const router = express.Router();
const url = require('url');
const argon2 = require('argon2');
const database = require('../database');

module.exports = app => {

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
            console.debug(`logging in user ${req.body.username}...`);
            const db = app.get('db');
            const userData = await database.userFetch(db.pool, req.body.username);
            if (userData) {
                const match = await argon2.verify(userData.password, req.body.password);
                if (match) {
                    await database.userUpdateLastLogin(db.pool, userData.id);
                    req.session.user = {
                        id: userData.id,
                        email: userData.email,
                        username: userData.username,
                        timezone: userData.timezone,
                    };
                    req.session.save(err => {
                        console.debug(`logged in user ${req.body.username} with id ${userData.id}`);
                        res.redirect('/plans');
                    });
                } else {
                    console.debug(`invalid password for user ${req.body.username}`);
                    res.redirect(url.format({
                        pathname: '/login',
                        query: {
                            'error': 'Invalid username or password',
                            }
                        })
                    );
                }
            } else {
                console.debug(`user ${req.body.username} not found`);
                res.redirect(url.format({
                    pathname: '/login',
                    query: {
                        'error': 'Invalid username or password',
                        }
                    })
                );
            }
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

    return router;
};