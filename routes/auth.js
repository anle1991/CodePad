var express = require('express');
var router = express.Router();
var passport = require('passport');

// Login page
router.route('/login')
  .get(function(req,res,next){
    res.render('login', {title: 'Login'});
  })
  .post(passport.authenticate('local',{
    failureRedirect: '/login'
  }), function(req,res){
    res.redirect('/');
  });

// Register page
router.route('/register')
  .get(function(req,res,next){
    res.render('register', {title: 'Register a new account'});
  })
  .post(function(req,res,next){
    req.checkBody('name', 'Empty Name').notEmpty();
    req.checkBody('email', 'Invalid Email').notEmpty();
    req.checkBody('password', 'Empty Password').notEmpty();
    req.checkBody('password', 'Password do not match').equals(req.body.confirmPassword).notEmpty();

    var errors = req.validationErrors();
    if(errors){
      res.render('register', {
        name: req.body.name,
        email: req.body.email,
        errorMessages: errors
      });
    }else{
      var user = new User();
      user.name = req.body.name;
      user.email = req.body.email;
      user.setPassword(req.body.password);
      user.save(function(err){
        if(err){
          res.render('register', {errorMessages: err});
        }else{
          res.redirect('/login');
        }
      })
    }
  });

// Logout Page
router.get('/logout', function(req,res){
  req.logout();
  res.redirect('/');
});

// Login with facebookId
router.get('/auth/facebook', passport.authenticate('facebook', {scope: 'email'}));

router.get('/auth/facebook/callback', passport.authenticate('facebook', {
  successRedirect: '/',
  failureRedirect: '/'
}));

module.exports = router;
