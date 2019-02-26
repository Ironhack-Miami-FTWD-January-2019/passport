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


router.get('/create', (req, res, next)=>{
  res.render('create');
})

router.post('/createNewHotSpot', (req, res, next)=>{
  console.log('createNewHotSpot',req.body)
  Hotspot.create(req.body).then(stuffFromDb=>{
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

module.exports = router;
