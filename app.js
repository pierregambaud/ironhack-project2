require('dotenv').config();

const bodyParser      = require('body-parser');
const cookieParser    = require('cookie-parser');
const express         = require('express');
const favicon         = require('serve-favicon');
const hbs             = require('hbs');
const mongoose        = require('mongoose');
const logger          = require('morgan');
const path            = require('path');
const session         = require("express-session");
const MongoStore      = require('connect-mongo')(session);
const bcrypt          = require("bcrypt");
const passport        = require("passport");
const LocalStrategy   = require("passport-local").Strategy;

mongoose
  .connect(process.env.MONGODB_URI, {useNewUrlParser: true})
  .then(x => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  })
  .catch(err => {
    console.error('Error connecting to mongo', err)
  });

const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

const app = express();


// middleware setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());


// passport initialization
app.use(session({
  secret: process.env.PASSPORT_LOCAL_STRATEGY_SECRET,
  store: new MongoStore( { mongooseConnection: mongoose.connection }),
  resave: true,
  saveUninitialized: true,
}));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, cb) => {
  cb(null, user._id);
});
passport.deserializeUser((id, cb) => {
  User.findById(id)
    .then(user => cb(null, user))
    .catch(err => cb(err))
  ;
});

passport.use(new LocalStrategy(
  {passReqToCallback: true},
  (...args) => {
    const [req,,, done] = args;

    const {username, password} = req.body;

    User.findOne({username})
      .then(user => {
        if (!user) {
          return done(null, false, { message: "Incorrect username" });
        }
          
        if (!bcrypt.compareSync(password, user.password)) {
          return done(null, false, { message: "Incorrect password" });
        }
    
        done(null, user);
      })
      .catch(err => done(err))
    ;
  }
));


// express view engine setup
app.use(require('node-sass-middleware')({
  src:  path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  sourceMap: true
}));
      

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));


// default value for title local
app.locals.title = 'Express - Generated with IronGenerator';


// routes
const appRoutes = require('./routes/index');
const authenticationRoutes = require('./routes/authentication');
const booksRoutes = require(`./routes/books`);
const usersRoutes = require(`./routes/users`);
app.use('/', appRoutes);
app.use('/', authenticationRoutes);
app.use('/api/books/', booksRoutes);
app.use('/api/users/', usersRoutes);


module.exports = app;
