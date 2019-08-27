const express = require('express');
const router = express.Router();
// User model
const User = require('../models/user');
// Hotspot model
const Hotspot = require('../models/hotspot');
var HS = [];
var NodeGeocoder = require('node-geocoder');

var options = {
  provider: 'google',

  // Optional depending on the providers
  httpAdapter: 'https', // Default
  apiKey: 'AIzaSyBDHQg3R9w2fSbdKrYv1vrKAE5sdOJ2uLU', // for Mapquest, OpenCage, Google Premier
  formatter: null // 'gpx', 'string', ...
};

var geocoder = NodeGeocoder(options);

// Using callback
geocoder.geocode('83 SW 8th St, Miami, FL 33130', function(err, res) {
  console.log(res);
});

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index', { user: req.user });
});

router.get('/create', isLoggedIn, (req, res, next) => {
  res.render('create', { user: req.user });
});

//CREATE NEW HOTSPOT
router.post('/createNewHotSpot', isLoggedIn, (req, res, next) => {
  let saveStuff = req.body;
  const protoName = req.body.name;
  const username = req.body.username;
  req.body.name = protoName.replace("'", '');
  console.log(req.body.name);
  saveStuff.userId = req.user._id;
  geocoder.geocode(saveStuff.location, function(err, response) {
    User.findOne({ username: username }).then(user => {
      // if (user !== null) {
      //   saveStuff.first = false;
      // }
      saveStuff.lat = response[0].latitude;
      saveStuff.lon = response[0].longitude;
      saveStuff.city = response[0].city;
      Hotspot.create(saveStuff).then(stuffFromDb => {
        res.redirect('profile');
      });
    });
  });
});

//VIEW PROFILE PAGE

router.get('/profile', isLoggedIn, (req, res, next) => {
  Hotspot.find({ userId: req.user._id }).then(hotspotsFromDb => {
    console.log();
    res.render('profile', { hotspots: hotspotsFromDb, user: req.user });
  });
});

//VIEW HOTSPOTS
router.get('/view-hotspots', (req, res, next) => {
  Hotspot.find().then(hotspotsFromDb => {
    res.render('view-hotspots', { hotspots: hotspotsFromDb, user: req.user });
  });
});

function isLoggedIn(req, res, next) {
  //Checks if user is logged in -middleware
  if (req.isAuthenticated()) return next();

  res.redirect('/login');
}

//DELETE HOTSPOT
router.post('/delete/:id', isLoggedIn, (req, res, next) => {
  Hotspot.findByIdAndRemove({ _id: req.params.id })
    .then(hotspotsFromDb => {
      res.redirect('/profile');
    })
    .catch(error => {
      console.log('Error => ', error);
    });
});

//CHECK IN AGAIN
router.post('/recheck/:id', isLoggedIn, (req, res, next) => {
  Hotspot.findById(req.params.id)
    .then(hotspot => {
      hotspot.visits++;
      hotspot.save(function(err) {
        if (!err) {
          res.redirect('/profile');
        }
      });
    })
    .catch(error => {
      console.log('Error => ', error);
    });
});

//MAP

router.get('/map', isLoggedIn, (req, res, next) => {
  Hotspot.find({ userId: req.user._id }).then(hotspotsFromDb => {
    HS.push(hotspotsFromDb);
    console.log(HS);
    res.render('map', { hotspots: hotspotsFromDb, user: req.user.username });
  });
});

//SEARCH FOR USER
router.post('/findName', isLoggedIn, (req, res, next) => {
  User.findOne({ username: req.body.username }).then(user => {
    if (!user) {
      res.redirect('/profile');
      return;
    }
    Hotspot.find({ userId: user._id })
      .then(hotspotsFromDb => {
        console.log(user, hotspotsFromDb);
        res.render('find', { user: user, hotspots: hotspotsFromDb });
      })
      .catch(error => {
        console.log('Error => ', error);
      });
  });
});

//ABOUT SECTION
router.get('/about', (req, res, next) => {
  res.render('about', { user: req.user });
});

module.exports = router;

// status code: /find
//     at ServerResponse.writeHead (_http_server.js:209:11)
