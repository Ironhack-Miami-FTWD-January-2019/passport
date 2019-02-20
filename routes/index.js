const express = require('express');
const router  = express.Router();

/* GET home page */
router.get('/', (req, res, next) => {
  console.log('req.session', req.session, 'req.user', req.user)
  res.render('index');
});

router.post('/rooms', isLoggedIn, (req, res, next) => {
  const newRoom = new Room ({
    name:  req.body.name,
    desc:  req.body.desc,
    owner: req.user._id   // <-- we add the user ID
  });

  newRoom.save ((err) => {
    if (err) { return next(err); }
    else {
      res.redirect('/rooms');
    }
  })
});

router.get('/rooms', isLoggedIn, (req, res, next) => {

  Room.find({owner: req.user._id}, (err, myRooms) => {
    if (err) { return next(err); }

    res.render('rooms/index', { rooms: myRooms });
  });

});




function isLoggedIn(req, res, next) {
  if (req.isAuthenticated())
      return next();

  res.redirect('/');
}







router.get('/private', checkRoles('GUEST'), (req, res) => {
  res.render('private', {user: req.user});
});


function checkRoles(role) {
  return function(req, res, next) {
    console.log('in check roles',req.user, role)
    if (req.isAuthenticated() && req.user.role === role) {
      return next();
    } else {
      res.redirect('/login')
    }
  }
}


module.exports = router;
