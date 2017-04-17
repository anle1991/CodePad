var express = require('express');
var router = express.Router();

var nodemailer = require('nodemailer');
var config = require('../config');
var transporter = nodemailer.createTransport(config.mailer);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Welcome to CodePad' });
});

// About page
router.get('/about', function(req, res, next) {
  res.render('about', { title: 'About CodePad' });
});

// Contact page
router.route('/contact')
.get(function(req,res,next){
  res.render('contact', { title: 'Contact'});
})
.post(function(req,res,next){
  req.checkBody('name', 'Name is required.').notEmpty();
  req.checkBody('email', 'Invalid email.').isEmail();
  req.checkBody('message', 'Message is required.').notEmpty();
  var errors = req.validationErrors();

  if(errors){
    res.render('contact', {
      title: 'Contact',
      name: req.body.name,
      email: req.body.email,
      message: req.body.message,
      errorMessages: errors
    });
  }else{
    var mailOptions = {
      from: 'CodePad <no-reply@ebay.com>',
      to: 'ebaynodejs@gmail.com',
      subject: 'CodePad Customer Contact 👻',
      text: req.body.message
    }

    transporter.sendMail(mailOptions, function(error,info){
      if(error){
        return console.log(error);
      }
      res.render('thank', { title: 'Thank you!'});
    });
  }
});



module.exports = router;
