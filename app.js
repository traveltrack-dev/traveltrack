// require dependencies
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const routes = require('./routes');
const package = require('./package.json');
const dotenv = require('dotenv');
const database = require('./database');
const expressSession = require('express-session');
const pgSession = require('connect-pg-simple')(expressSession);

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
  secret: process.env.SECRET || 'secret',
  session_length: process.env.SESSION_LENGTH || 1440,
};

// app setup
const app = express();
app.set('port', config.port);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// frontend dependencies
app.use('/lucide', express.static(path.join(__dirname, 'node_modules/lucide/dist/umd')));

// http error handling
app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

(async () => {
  console.info('connecting to database...');
  const db = await database.connect(config);
  app.set('db', db)

  console.info('connected to database, running migrations...');
  await database.migrate(db.client);

  console.info('migrations complete, starting web app...');

  // session setup
  app.use(expressSession({
    store: new pgSession({
      pool : db.pool,
      tableName : 'sessions'
    }),
    name: 'traveltrack_session',
    saveUninitialized: false,
    secret: config.secret,
    resave: false,
    cookie: { maxAge: config.session_length * 60 * 1000 }
  }));

  // routes setup
  routes.setup(app);

  app.listen(app.get('port'), async () => {
    console.info(`traveltrack ${package.version} is now listening on ${config.public_url}`);
  });
})();

