const createError = require('http-errors');
const url = require('url');
const indexRouter = require('./routes/index');
const plansRouter = require('./routes/plans');
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
    app.use('/login', require('./routes/login')(app));
    app.use('/plans', validateSession, plansRouter);
    app.use('/logout', logoutRouter);
    app.use('/register', require('./routes/register')(app));
    app.use((req, res, next) => {
      next(createError(404));
    });
};
