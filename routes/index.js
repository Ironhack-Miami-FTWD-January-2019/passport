const express = require('express');
const router  = express.Router();

/* GET home page */
router.get('/', checkRoles('ADMIN'), (req, res, next) => {
  console.log('req.session', req.session, 'req.user', req.user)
  res.render('index');
});


function isLoggedIn(req, res, next) {
  if (req.isAuthenticated())
      return next();

  res.redirect('/login');
}

function checkRoles(role) {
  return function(req, res, next) {
    if (req.isAuthenticated() && req.user.role === role) {
      return next();
    } else {
      res.redirect('/login')
    }
  }
}

module.exports = router;
