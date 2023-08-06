const createError = require('http-errors');
const url = require('url');
const indexRouter = require('./routes/index');
const logoutRouter = require('./routes/logout');

const validateSession = async (req, res, next) => {    
  console.debug(`validating session: ${req.session.id}...`);
  if (req.session.user) {
      console.debug(`found user session for ${req.session.user.username} with id ${req.session.user.id}`);
      next();
  } else {
    console.debug('no user session found, redirecting to login page');
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
    app.use('/plans', validateSession, require('./routes/plans')(app));
    app.use('/logout', logoutRouter);
    app.use('/register', require('./routes/register')(app));
    app.use((req, res, next) => {
      next(createError(404));
    });
};
