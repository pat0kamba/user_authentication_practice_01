const express = require('express');
const router = express.Router();
const User = require('../models/user_model.js')

router.get('/home', (req, res)=>{
    res.render('home')
}
);

router.get('/login', (req,res)=>{
    res.render('login')
});

router.get('/register', (req, res)=>{
    res.render('register')
});

router.get('/failure', (req, res)=>{
    res.render('failure')
}
);

router.get('/success', (req, res)=>{
    res.render('success');
})

module.exports = router