const express = require('express');
const router  = express.Router();
const Comment = require('../models/comments')
/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.get('/dashboard', isLoggedIn, (req, res, next) => {
  Comment.find().populate('userId').then(commentsFromDatabase=>{
    commentsFromDatabase.forEach(comment=>{
      console.log('121',comment.userId._id, req.user._id)
      if(String(comment.userId._id) === String(req.user._id)){
        comment.yours = true; 
      }
    })
    console.log(commentsFromDatabase)
    res.render('dashboard.hbs', {commentstoHBS:commentsFromDatabase});
  })
});

router.post('/tradeIdea/add', isLoggedIn, (req, res, next) => {
  console.log(req.body)
  let stuffSaid = req.body.comment;
  let comment = new Comment({ comment:stuffSaid, userId:req.user._id})
  comment.save(()=>{ //wait until done saving before redirect
    res.redirect('../dashboard')
  });
});

router.post('/delete/:idComingFromTheDeleteForm', isLoggedIn, (req, res, next) => {
  //req.user._id
  Comment.remove({_id:req.params.idComingFromTheDeleteForm}).then(stuffFromDb=>{
    res.redirect('../dashboard')
  })
})

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated())
      return next();

  res.redirect('/login');
}



module.exports = router;
