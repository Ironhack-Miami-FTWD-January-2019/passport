const express = require('express');
const router  = express.Router();
// User model
const User = require("../models/user");
// Hotspot model
const Hotspot = require("../models/hotspot");



/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});


router.get('/create', isLoggedIn, (req, res, next)=>{
  res.render('create');
})

router.post('/createNewHotSpot', isLoggedIn, (req, res, next)=>{
  let saveStuff = req.body;
  const username = req.body.username;
  saveStuff.userId = req.user._id

  User.findOne({ "username": username })
  .then(user => {
    if (user !== null) {
        saveStuff.first = false;
      }
    Hotspot.create(saveStuff).then(stuffFromDb=>{
      res.redirect('profile')
    })
  //res.render('create');
  })
});


router.get('/view-hotspots', (req, res, next) => {
  console.log('hi')
  Hotspot.find().then(hotspotsFromDb=>{
    res.render('view-hotspots', {hotspotsToHBS:hotspotsFromDb});
  })
});



function isLoggedIn(req, res, next) { //Checks if user is logged in -middleware
  if (req.isAuthenticated())
      return next();

  res.redirect('/login');
}

router.get('/profile', isLoggedIn, (req, res, next)=>{
  Hotspot.find({userId:req.user._id}).then(hotspotsFromDb=>{
    res.render('profile', {hotspots:hotspotsFromDb, user: req.user});
  })

})

//DELETE HOTSPOT
router.post('/delete/:id', isLoggedIn, (req, res, next) =>{
  Hotspot.findByIdAndRemove({_id: req.params.id})
  .then(hotspotsFromDb => {
    res.redirect('/profile');
  })
  .catch(error => {
    console.log('Error => ', error);
    });
})

//CHECK IN AGAIN
router.post('/recheck/:id', isLoggedIn, (req, res, next) => {

  Hotspot.findById(req.params.id)
    .then(hotspot=>{
      hotspot.visits++;
      hotspot.save(function(err){
        if(!err){
          res.redirect('/profile');
        }
      })
    }).catch(error => {
    console.log('Error => ', error);
  });
})


//SEARCH FOR USER
router.post('/findName', isLoggedIn, (req, res, next) => {
  User.findOne({username:req.body.username})
  .then(user=>{
    Hotspot.find({userId:req.user._id}).then(hotspotsFromDb=>{
      res.render('find', {user:user, hotspots:hotspotsFromDb})
    })
    .catch(error => {
      console.log('Error => ', error);
      });
  })
})

// router.get('/find', isLoggedIn, (req, res, next) => {
//   console.log("GET")
//   Hotspot.findById(req.params.id)
//   .then(hotspotsByUser => {
//     res.render('find');
//     console.log(user, hotspots)
//   })
//   .catch(error => {
//     console.log('Error => ', error);
//     });
// });

module.exports = router;

// status code: /find
//     at ServerResponse.writeHead (_http_server.js:209:11)