const express = require('express');
const router = express.Router();
const User = require('../models/user_model.js');
const passport = require('passport');
// const passportLocalMongoose = require('passport-local-mongoose');

//passport local configuration on the model

// passport use a local strategy
// CHANGE: USE "createStrategy" INSTEAD OF "authenticate"
// create a passport strategy on the User model
passport.use(User.createStrategy());

// need to be able to create a session and read from a session created
// passport serialize and deserialize the User model

passport.serializeUser(function(User, done) {
    done(null, User);
  });
  
  passport.deserializeUser(function(User, done) {
    done(null, User);
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

// register the user, hash their password
router.post('/register', (req, res)=>{
    const { password, username} = req.body;
    console.log("username: ", username);
    console.log("password: ", password);
  
    // using the register passport local method which takes the username, the password and a callback as argument
    User.register({username:username}, password, function(error,user){
   
            
        if(!error){
            console.log('user authentication succeeded');
            User.authenticate("local")(req, res, function(){
                res.redirect('/auth/success');
            });
        }
        console.log('there is an error');
        res.redirect('/auth/register');
            // if no error, authenticate the user using passport local
           
        
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
         User.authenticate('local')(req, res, function(){
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