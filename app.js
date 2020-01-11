require(`dotenv`).config();


const cookieParser       = require(`cookie-parser`);
const express            = require(`express`);
const favicon            = require(`serve-favicon`);
const hbs                = require(`hbs`);
const mongoose           = require(`mongoose`);
const logger             = require(`morgan`);
const path               = require(`path`);
const session            = require(`express-session`);
const uest               = require(`uest`);
const MongoStore         = require(`connect-mongo`)(session);
const bcrypt             = require(`bcrypt`);
const passport           = require(`passport`);
const LocalStrategy      = require(`passport-local`).Strategy;
const FacebookStrategy   = require(`passport-facebook`).Strategy;
const TwitterStrategy    = require(`passport-twitter`).Strategy;
const User               = require(`./models/user.js`);

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


// set Default 'Accept' and 'Content-Type'
app.use(function (req, res, next) {
  req.headers['accept'] = req.headers['accept'] || 'application/json';

  // if 'Accept: application/json' and 'Content-Type' is not set => defaults to 'application/json'
  if (req.headers['accept'] === 'application/json' && !req.headers['content-type']) {
    req.headers['content-type'] = req.headers['content-type'] || 'application/json';
  }

  next();
});

const bodyParser = require('body-parser');


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

app.use(uest());

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

// override username by email
passport.use(new LocalStrategy({
  usernameField: 'email',
  passReqToCallback: true
}, (...args) => {
  const [req,,, done] = args;

  const {email, password} = req.body;

  User.findOne({email})
    .then(user => {
      if (!user) {
        return done(null, false, { message: "Incorrect email" });
      }
        
      if (!bcrypt.compareSync(password, user.password)) {
        return done(null, false, { message: "Incorrect password" });
      }
  
      done(null, user);
    })
    .catch(err => done(err));
  }
));

passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_APP_ID,
  clientSecret: process.env.FACEBOOK_APP_SECRET,
  callbackURL: "/api/0.1/sessions/facebookCallback",
  profileFields: [
    "id",
    "displayName",
    "email",
    "picture.type(large)"
  ]
},
  (accessToken, refreshToken, profile, done) => {
    process.nextTick(() => {
      console.log('facebook success:', profile, accessToken, refreshToken);

      return done(null, profile);
    });
  }
));

passport.use(new TwitterStrategy({
  consumerKey: process.env.TWITTER_CONSUMER_KEY,
  consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
  callbackURL: "/api/0.1/sessions/twitterCallback"
},
function(token, tokenSecret, profile, cb) {
  console.log("Twitter account details: ", profile);

  User.findOrCreate({ twitterId: profile.id }, function (err, user) {
    return cb(err, user);
  });
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

hbs.registerPartials(__dirname + '/views/partials');


// default value for title local
app.locals.title = `BlablaLivre - Critiques de livres en 140 caractères`;


// API routes
const apiRoutes = require('./routes/api');
app.use(`/api/0.1/`, apiRoutes);


// APP routes
const appRoutes = require('./routes/index');
app.use('/', appRoutes);


// errors middlewares
app.use((req, res, next) => {
  let err = new Error();
  err.status = 404;

  next(err);
});

er2JSON = function (err) {
  // http://stackoverflow.com/questions/18391212/is-it-not-possible-to-stringify-an-error-using-json-stringify#18391212
  var o = {};

  Object.getOwnPropertyNames(err).forEach(function (key) {
    o[key] = err[key];
  });

  return o;
}

app.use((err, req, res, next) => {
  // always log the error
  // console.error('ERROR', req.method, req.path, err);

  res.format({  
    html: function () {
      res.render(`error`, {
        err
      });
    },
  
    json: function () {
      res.send({err: er2JSON(err)});
    }
  })
});


module.exports = app;