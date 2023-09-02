const express = require('express');
const router = express.Router();
const database = require('../database');
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
        header: plan.name,
        text: [
          `<div class="flex items-center"><i data-lucide="calendar-days" class="w-5 h-5 mr-1"></i> ${DateTime.fromISO(plan.start_date, { zone: 'UTC' }).setZone(user.timezone).toLocaleString(DateTime.DATE_MED)} - ${DateTime.fromISO(plan.end_date, { zone: 'UTC' }).setZone(user.timezone).toLocaleString(DateTime.DATE_MED)}</div>`,
          `<div class="flex items-center"><i data-lucide="ticket" class="w-5 h-5 mr-1"></i> ${plan.operators} </div>`,
        ],
        link: `/plans/${plan.id}`,
        photo: {
          data: plan.photo_data,
          mimeType: plan.photo_mime_type,
        }
      }
    });
    console.debug(`fetched ${plans.length} plans for user ${user.username} with id ${user.id}`)
    res.render('list', {
      title: 'Plans',
      items: plans,
    });
  });

  router.get('/:planId', async (req, res, next) => {
    const user = req.session.user;
    console.debug(`fetching plan ${req.params.planId} for user ${user.username} with id ${user.id}...`);
    const db = app.get('db');
    let plan = await database.planFetch(db.pool, req.params.planId, user.id);
    let lines = [];
    let bookings = plan.bookings.map(booking => {
      return {
        content: {
          "#": booking.booking_id,
          "Booking": `${booking.operator_name} ${booking.booking_code}`,
          "Booking Date": DateTime.fromISO(booking.booking_date, { zone: 'UTC' }).setZone(user.timezone).toLocaleString(DateTime.DATE_MED),
          "Type": booking.operator_type,
          "Price": `${booking.booking_price} ${booking.booking_currency}`,
        },
        link: `/plans/${plan.details.id}/bookings/${booking.booking_id}`,
      };
    });
    res.render('table', {
      title: plan.details.name,
      lines: lines,
      results: bookings
    });
  });

  router.get('/:planId/bookings/:bookingId', async (req, res, next) => {
    const user = req.session.user;
    console.debug(`fetching plan ${req.params.planId} for user ${user.username} with id ${user.id}...`);
    const db = app.get('db');
    let booking = await database.bookingFetch(db.pool, req.params.bookingId, user.id);
    let lines = [];
    let legs = booking.legs.map(leg => {
      return {
        content: {
          "#": leg.leg_id,
          "Type": leg.type,
          "Operator": leg.operator_name,
          "Leg": leg.trip_number,
          "Route": `${(leg.departure_iata_code || leg.departure_name)} → ${(leg.arrival_iata_code || leg.arrival_name)}`,
          "Departure": DateTime.fromISO(leg.departure_time, { zone: 'UTC' }).setZone(user.timezone).toLocaleString(DateTime.DATETIME_MED),
          "Arrival": DateTime.fromISO(leg.arrival_time, { zone: 'UTC' }).setZone(user.timezone).toLocaleString(DateTime.DATETIME_MED),
        }
      };
    });
    res.render('table', {
      title: `${booking.details.operator_name} ${booking.details.booking_code}`,
      lines: lines,
      results: legs
    });
  });

  return router;
};