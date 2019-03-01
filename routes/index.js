const express = require('express');
const router  = express.Router();
const Comment = require('../models/comments')
/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.get('/dashboard', isLoggedIn, (req, res, next) => {
  Comment.find().sort({created_at: -1}).populate('userId').then(commentsFromDatabase=>{
    commentsFromDatabase.forEach(comment=>{
      //console.log('121',comment.userId._id, req.user._id)
      if(String(comment.userId._id) === String(req.user._id)){
        comment.yours = true; 
      }
    })
    console.log(commentsFromDatabase,"hippo");
    res.render('dashboard.hbs', {commentstoHBS:commentsFromDatabase});
  })
});

// router.get('/practice-chart', (req, res, next) => {
 
//     //console.log(commentsFromDatabase)
//     res.render('practice-chart.hbs', {});
// });


router.post('/tradeIdea/add', isLoggedIn, (req, res, next) => {
  console.log(req.body)
  let stuffSaid = req.body.comment;
  let comment = new Comment({ comment:stuffSaid, userId:req.user._id})
  comment.save(()=>{ //wait until done saving before redirect
    res.redirect('../dashboard')
  });
});

router.get('/edit/:id', isLoggedIn, (req, res, next) => {
  //Model.find({}) will return an array even if there's one []
  //Model.findOne({email:req.params.email}) will allways return one
  //Model.findById(req.params.id) will allways return one
  Comment.findOne({_id:req.params.id}).then(comment=>{
    //console.log('haha ',comment)
    res.render('comment-edit', {comment})
  }).catch(err=> console.error(err))
});


router.post('/edit/:id', isLoggedIn, (req, res, next) => {
  console.log('now save this to the db',req.params, req.body)
  Comment.findOne({_id:req.params.id}).then(comment => {
    comment.comment = req.body.comment
    comment.save(() => 
    {
      res.redirect('../dashboard')
    });
  })
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
