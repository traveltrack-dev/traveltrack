const createError = require('http-errors');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

exports.setup = app => {
    app.use('/', indexRouter);
    app.use('/users', usersRouter);
    app.use(function(req, res, next) {
      next(createError(404));
    });
};


