const express = require('express');
const router = express.Router();
const database = require('../database');
const url = require('url');
const { DateTime } = require("luxon");

module.exports = app => {
  /*
    GET /plans
    plans list page  
  */
  router.get('/', async (req, res, next) => {
    const user = req.session.user;
    console.debug(`fetching plans for user ${user.username} with id ${user.id}...`);
    const db = app.get('db');
    let plans = await database.plansFetch(db.pool, user.id);
    plans = plans.map(plan => {
      return {
        content: {
          "#": plan.id,
          "Name": plan.name,
          "Start Date": DateTime.fromJSDate(plan.start_date).setZone(user.timezone).toLocaleString(DateTime.DATE_MED),
          "End Date": DateTime.fromJSDate(plan.end_date).setZone(user.timezone).toLocaleString(DateTime.DATE_MED),
        },
        link: `/plans/${plan.id}`,
      }
    });
    console.debug(`fetched ${plans.length} plans for user ${user.username} with id ${user.id}`)
    res.render('table', {
      title: 'Plans',
      results: plans,
    });
  });

  router.get('/:planId', async (req, res, next) => {
    const user = req.session.user;
    res.render('table', {
      title: 'Plan Details',
      results: [],
    });
  });

  return router;
};