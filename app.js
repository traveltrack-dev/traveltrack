// require dependencies
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const routes = require('./routes');
const package = require('./package.json');
const dotenv = require('dotenv');
const database = require('./database');

// app config
dotenv.config();
const port = parseInt(process.env.PORT) || 3000;
const config = {
  db_host: process.env.DB_HOST || 'localhost',
  db_port: process.env.DB_PORT || '5432',
  db_name: process.env.DB_NAME || 'traveltrack',
  db_user: process.env.DB_USER || 'traveltrack',
  db_password: process.env.DB_PASSWORD || 'traveltrack',
  port: port,
  public_url: process.env.PUBLIC_URL || `http://localhost:${port}`,
};

// app setup
const app = express();
routes.setup(app);
app.set('port', config.port);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// http error handling
app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

// database setup
console.info('connecting to database...');
database.connect(config).then(client => {
  return client;
}).catch((err) => {
  console.error('failed to connect to database');
  console.debug(err);
  process.exit(1);
}).then(client => {
  console.info('connected to database, running migrations...');
  return database.migrate(client);
}).catch((err) => {
  console.error('failed to run migrations');
  console.debug(err);
  process.exit(1);
}).then(client => {
  console.info('migrations complete, starting server...');

  // start server
  app.listen(app.get('port'), () => {

    console.info(`start complete, traveltrack ${package.version} is now listening on ${config.public_url}`);

  });
}).catch((err) => {
  console.error('failed to start server');
  console.debug(err);
});

