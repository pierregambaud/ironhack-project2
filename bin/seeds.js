require('dotenv').config();

const mongoose = require(`mongoose`);
const User = require(`../models/user.js`);
const Book = require(`../models/book.js`);
const Review = require(`../models/review.js`);

mongoose.connect(process.env.MONGODB_URI);

const rawUsers = [
  {
    email: `paul@beatles.co.uk`,
    password: `liverpool`,
    username: `Paul`,
    slug: `paul`
  },
  {
    email: `conor@mcgregor.com`,
    password: `mma4ever`,
    username: `Conor`,
    slug: `conor`
  },
  {
    email: `roger@rabbit.com`,
    password: `jessica`,
    username: `Roger`,
    slug: `roger`
  },
  {
    email: `thierry@lhermitte.fr`,
    password: `tititi`,
    username: `thierry`,
    slug: `thierry`
  }
];

const rawBooks = [
  {
    isbn: `2010008995`,
    isbn13: `978-2010008993`,
    asin: `B007P4MJ0S`,
    title: `Les misérables`,
    slug: `miserables`,
    authors: `Victor Hugo`,
    coverPath: `https://images-na.ssl-images-amazon.com/images/I/51W2mjLTYCL._SX349_BO1,204,203,200_.jpg`,
    publisher: `Livre de Poche Jeunesse`,
    publicationDate: `2014-08-13`,
    rating: `5`
  },
  {
    isbn: `2070360024`,
    isbn13: `978-2070360024`,
    asin: `B007GI5SII`,
    title: `L'étranger`,
    slug: `etranger`,
    authors: `Albert Camus`,
    coverPath: `https://images-na.ssl-images-amazon.com/images/I/41PtKES1gvL._SX301_BO1,204,203,200_.jpg`,
    publisher: `Gallimard`,
    publicationDate: `1971-12-01`,
    rating: `4`
  },
  {
    isbn: `2234087368`,
    isbn13: `978-2234087361`,
    asin: `B082DL7XZK`,
    title: `Sympathie pour le Diable`,
    slug: `sympathie-pour-diable`,
    authors: `Paul Marchand`,
    coverPath: `https://images-na.ssl-images-amazon.com/images/I/511Y%2BcYTihL._SX312_BO1,204,203,200_.jpg`,
    publisher: `Stock`,
    publicationDate: `2019-11-20`,
    rating: `4`
  },
  {
    isbn: `289225955X`,
    isbn13: `978-2892259551`,
    asin: `B082VJ6DKN`,
    title: `Père riche, père pauvre`,
    slug: `pere-riche-pere-pauvre`,
    authors: `Robert T. Kiyosaki`,
    coverPath: `https://images-na.ssl-images-amazon.com/images/I/51ijjHLLiCL._SX332_BO1,204,203,200_.jpg`,
    publisher: `Un monde different`,
    publicationDate: `2017-12-01`,
    rating: `3`
  }
];

const rawReviews = [
  {
    book_id: ``,
    user_id: ``,
    rating: `5`,
    review: `Ce livre est une référence : les personnages, l'histoire, la tension. A lire !`,
    url: ``
  },
  {
    book_id: ``,
    user_id: ``,
    rating: `4`,
    review: `Un très bon classique qui traite d'un sujet délicat. Touchant et émouvant.`,
    url: `https://www.leblogdulitteraire.fr/critiques/12`
  },
  {
    book_id: ``,
    user_id: ``,
    rating: `4`,
    review: `Des livres comme il en existe trop peu. On est transporté du début à la fin !`,
    url: ``
  },
  {
    book_id: ``,
    user_id: ``,
    rating: `3`,
    review: `Une dystopie accessible et prenante, des personnages attachants, le tout dans un pseudo huit clos. A lire pour les fans de SF`,
    url: ``
  }
]


User.create(rawUsers) // create users
  .then(users => {
    console.log(`${users.length} users created`);
    
    Book.create(rawBooks) // create books
      .then(books => {
        console.log(`${books.length} books created`);
  
        rawReviews.map((review, i) => { // update reviews with books and users ids
          review.book_id = books[i].id;
          review.user_id = users[i].id;
          return review;
        });

        Review.create(rawReviews) // create reviews
          .then(reviews => {
            console.log(`${reviews.length} reviews created`);
            
            const booksIds = books.map(book => book.id);
            const reviewsIds = reviews.map(review => review.id);
            const usersIds = users.map(user => user.id);

            reviewsIds.forEach((reviewId, i) => { // assign favorite book and review to users
              User.findByIdAndUpdate(usersIds[i],
                { $set: {
                  "favoritesBooks": booksIds[i],
                  "reviews": reviewId
                } }
              )
                .then(() => {
                  console.log(`Book ${i} and review ${i} assigned to user`);

                  Book.findByIdAndUpdate(booksIds[i], // assign review to book
                    { $push: {
                        "reviews": reviewId,
                    } }
                  )
                    .then(() => {
                      console.log(`Review ${i} assigned to book`);

                      mongoose.connection.close();
                    })
                    .catch(err => console.error(err));
                })
                .catch(err => console.error(err));
            })
          })
          .catch(err => console.error(err));
      })
      .catch(err => console.error(err));
  })
  .catch(err => console.error(err));