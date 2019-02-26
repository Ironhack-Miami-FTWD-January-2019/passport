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
  saveStuff.userId = req.user._id
  console.log('createNewHotSpot',req.body, ' nbut out user is', req.user)

  Hotspot.create(saveStuff).then(stuffFromDb=>{
    res.redirect('view-hotspots')
  })
  //res.render('create');
})

router.get('/view-hotspots', (req, res, next) => {
  console.log('hi')
  Hotspot.find().then(hotspotsFromDb=>{
    res.render('view-hotspots', {thisGoesToHBS:'soyou  can see this', hotspotsToHBS:hotspotsFromDb});
  })
});



function isLoggedIn(req, res, next) { //CHecks if user is logged in -middleware
  if (req.isAuthenticated())
      return next();

  res.redirect('/login');
}

router.get('/profile', isLoggedIn, (req, res, next)=>{
  Hotspot.find({userId:req.user._id}).then(hotspotsFromDb=>{
    res.render('profile', {hotspots:hotspotsFromDb});
  })

})

module.exports = router;
