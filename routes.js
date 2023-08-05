const createError = require('http-errors');
const url = require('url');
const indexRouter = require('./routes/index');
const plansRouter = require('./routes/plans');
const loginRouter = require('./routes/login');
const logoutRouter = require('./routes/logout');

const validateSession = (req, res, next) => {    
  console.debug(`Validating session: ${req.session.id}...`);
  if (req.session.user) {
      console.debug(`Found user session for ${req.session.user.username}`);
      next();
  } else {
    console.debug('No user session found, redirecting to login page');
    res.redirect(url.format({
        pathname: '/login',
        query: {
          'warning': 'Please login to continue',
        }
      })
    );
  }
};

exports.setup = app => {
    app.use('/', indexRouter);
    app.use('/login', loginRouter);
    app.use('/plans', validateSession, plansRouter);
    app.use('/logout', logoutRouter);
    app.use(function(req, res, next) {
      next(createError(404));
    });
};
