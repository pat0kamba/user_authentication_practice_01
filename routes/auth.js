const express = require('express');
const router = express.Router();
const User = require('../models/user_model.js');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;



passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "https://localhost:5000/auth/google/success"
  },
  function(accessToken, refreshToken, profile, cb) {
    User.findOrCreate({ googleId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));
//passport local configuration on the model

// passport use a local strategy
// CHANGE: USE "createStrategy" INSTEAD OF "authenticate"
// create a passport strategy on the User model
passport.use(User.createStrategy());

// need to be able to create a session and read from a session created
// passport serialize and deserialize the User model

passport.serializeUser(function(user, done) {
    process.nextTick(function() {
      done(null, { id: user.id, username: user.username, name: user.name });
    });
  });
  
  passport.deserializeUser(function(user, done) {
    process.nextTick(function() {
      return done(null, user);
    });
  });

router.get('/home', (req, res)=>{
    res.render('home');
}
);

router.get('/login', (req,res)=>{
    res.render('login')
});

router.get('/register', (req, res)=>{
    res.render('register')
});

router.get('/google',
  passport.authenticate('google', { scope: ['profile'] }));

router.get('/google/success', 
  passport.authenticate('google', { failureRedirect: '/auth/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/auth/home');
  });
// register the user, hash their password
router.post('/register', (req, res)=>{
    const { password, username} = req.body;
    console.log("username: ", username);
    console.log("password: ", password);
  
    const user = new User({username:username});
    // using the register passport local method which takes the username, the password and a callback as argument
    User.register(user, password, function(error,user){
        
        if(error)
        {
            console.log('there is an error');
            res.redirect('/auth/register');
        }
        // if no error, authenticate the user using passport local   
        else{
            console.log('user authentication succeeded');
            passport.authenticate("local")(req, res, function(){
                res.redirect('/auth/success');
            });
        }
       
           
        
    })
});

// login using passport local
router.post('/login', (req, res)=>{

// grab data from the user and store in a mongodb model
 const user = new User({
     username:req.body.username,
     password:req.body.password
 });

 // login using the express login method which takes the user model and a callback as argument
 req.login(user, function(error){
     if(error){
         console.log(error)
     }else{
         // if there is not error, authenticate the user using the local strategy
         passport.authenticate('local')(req, res, function(){
             // if user is authenticated, redirect the user to the success page
             res.redirect('/auth/success')
         })
     }
 })
})

router.get('/failure', (req, res)=>{
    res.render('failure')
}
);

router.get('/success', (req, res)=>{
    // checking if the user is authenticated
    if(req.isAuthenticated())
    {
        // if yes, render the success page
        res.render('success');
    }else{
        // if not, redirect the user to the home page
        res.redirect('/auth/login')
    }
    
});

router.get('/logout', (req,res, next)=>{

    // de-authenticate the user use the logout express method
    req.logout(function(error){
        if(error){
            // next function to display any error
            next(error);
        }
    });
    // and redirect the user to the home page
    res.redirect('/auth/home');
});

module.exports = router