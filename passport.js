var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;

// Use serialization to store session
passport.serializeUser(function (user,done){
  console.log("serializeUser for session");
  done(null, user._id);
});

passport.deserializeUser(function (id,done){
  User.findOne({_id: id}, function(err,user){
    console.log("deserializeUser for session");
    done(err,user);
  })
});

// Use local strategy for in house login
passport.use(new LocalStrategy({
    usernameField: 'email'
  },
  function(username, password, done){
    User.findOne({email: username}, function(err, user){
      if(err) return done(err);

      if(!user){
        return done(null, false, {
          message: 'Incorrect username or password'
        });
      }

      if(!user.validPassword(password)){
        return done(null, false, {
          message: 'Incorrect username or password'
        });
      }

      return done(null,user);
    })
}));

// Use facebook Strategy to login with facebook profile
passport.use(new FacebookStrategy({
    clientID: '385986535116165',
    clientSecret: '8b6256cf958a044b4084f83b2f083f15',
    callbackURL: 'http://localhost:3000/auth/facebook/callback',
    profileFields: ['id', 'displayName', 'photos', 'email']
  },
  function(token, refreshToken, profile, done){
    // Search local db for match facebookId
    User.findOne({'facebookId': profile.id}, function(err, user){
      if(err) return done(err);

      if(user){
        return done(null, user);
      }
      // If found duplication, save update info
      else{
        User.findOne({email: profile.emails[0].value}, function(err, user){
          if(user){
            user.facebookId = profile.id;
            return user.save(function(err){
              if(err) return done(null, false, {message: "Can't save user info"});
              return done(null, user);
            })
          }

          var user = new User();
          user.name = profile.displayName;
          user.email = profile.emails[0].value;
          user.facebookId = profile.id;
          user.save(function(err){
            if(err) return done(null, false, {message: "Can't save user info"});
            return done(null, user);
          });
        })
      }

    });
  }
));
