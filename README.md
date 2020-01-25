# IronHack Project 2 - BlablaLivre v0

BlablaLivre is a **books micro-reviews social network**. Inspired by Twitter 140 characters message, BlablaLivre adapts this format to book reviews.

Main goal: **get a global overview of book in less than 1 minute with multiples shorts and pertinents micro-reviews**.

A **dedicated CRUD API** has been coded for book, review and user models. A **mobile version of an APP** connects to this API.

**List of current API functionnalities:**
* User (CRUD)
  * includes Facebook and Twitter signup
* Book (CRUD)
* Review (CRUD)
* Search (basic search)


## Getting Started

### Prerequisites
* Node.js
* NPM
* MongoDB

### Configuring .env
Update `.env` with
```
PORT=3000
ENV=development
MONGODB_URI=YOURURI
PASSPORT_LOCAL_STRATEGY_SECRET=YOURPASSWORDLSECRET
FACEBOOK_APP_ID=YOURFACEBOOKID
FACEBOOK_APP_SECRET=YOURFACEBOOKSECRET
TWITTER_CONSUMER_KEY=YOURTWITTERKEY
TWITTER_CONSUMER_SECRET=YOURTWITTERSECRET
BCRYPT_SALT=10
```

### Seeding
Seed the database: `$ node bin/seeds.js`

### Launching
Launch the APP: `$ npm run dev`


## Routes

### API routing
| verbs | route | Controller#Action | private | admin |
| - | - | - | - | - |
| ### | **SESSIONS** | ### | ### | ### |
| POST | /api/0.1/sessions | sessions#new | no | no |
| DELETE | /api/0.1/session | sessions#destoy | no | no |
| GET | /api/0.1/sessions/facebook | sessions#facebook | no | no |
| GET | /api/0.1/sessions/twitter | sessions#twitter | no | no |
| ### | **SEARCH** | ### | ### | ### |
| GET | /api/0.1/search/:query | search#search | no | no |
| ### | **USERS** | ### | ### | ### |
| GET | /api/0.1/users | users#index | no | yes |
| POST | /api/0.1/users | users#create | yes | yes |
| GET | /api/0.1/users/:slugOrId | users#show | no | yes |
| PUT | /api/0.1/users/:id| users#update | yes | yes |
| DELETE | /api/0.1/users/:id| users#destroy | yes | yes |
| ### | **BOOKS** | ### | ### | ### |
| GET | /api/0.1/books | books#index | no | no |
| POST | /api/0.1/books | books#create | yes | yes |
| GET | /api/0.1/books/:slugOrId | books#show | no | no |
| PUT | /api/0.1/books/:id | books#update | yes | yes |
| DELETE | /api/0.1/books/:id| books#destroy | yes | yes |
| ### | **REVIEWS** | ### | ### | ### |
| GET | /api/0.1/reviews | reviews#index | no | no |
| POST | /api/0.1/reviews |  reviews#create | yes | no |
| GET | /api/0.1/reviews/:id | reviews#show | no | no |
| PUT | /api/0.1/reviews/:id | reviews#update | yes | no |
| DELETE | /api/0.1/reviews/:id | reviews#destroy | yes | yes |

### APP routing
| verbs | route | template | private | admin |
| - | - | - | - | - |
| ### | **ROUTING** | ### | ### | ### |
| GET | / | views/index.hbs | no / yes | no |
| GET | /inscription | views/signup.hbs | no | no |
| POST | /inscription | (post form inscription) | no | no |
| POST | /connexion | (post form connexion) | no | no |
| GET | /connexion-facebook | - | no | no |
| GET | /connexion-twitter | - | no | no |
| DELETE | /deconnexion | - | no | no |
| GET | /profil | views/profile.hbs | yes | no |
| GET | /recherche/:query | views/search.hbs | no | no |
| GET | /livres | views/books/index.hbs | no | no |
| GET | /livre/:slugOrId | views/books/show.hbs | no | no |
| POST | /livre/:slugOrId | (post from review) | no | no |
| GET | /critiques | views/reviews/index.hbs | no | no |
| GET | /membre/:slugOrId | views/users/show.hbs | no | no |


## Demo

On Heroku - http://ironhack-project2-pierre.herokuapp.com/


## Author

Pierre Gambaud - https://github.com/pierregambaud


## Acknowledgments

A special thanks to **Antoine Bernier** for its huge help and support! - https://github.com/abernier/