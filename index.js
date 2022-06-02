require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const mongoose = require('mongoose');
const ejs = require('ejs');
const path = require('path')
const app = express();
const PORT = process.env.PORT || 5000;
const authRouter = require('./routes/auth.js');
// set up mongodb using mongoose
mongoose.connect(process.env.MONGO_URI, 
    {useNewUrlParser:true, useUnifiedTopology:true});

//check if connected to the Database
const db = mongoose.connection;
db.on('error', (error)=>console.log(error));
db.once('open', ()=>console.log('successfully connected to the Database'));


// make static files public
app.use(express.static(path.join(__dirname,'/public')));

// set up the route

app.use('/auth', authRouter);
// bodyParser to grab data from the request body 
// and be able to read json data
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

// the cors package
app.use(cors());

// the helmet package helps secure the express app by setting various http headers
app.use(helmet());

// the morgan package is an http request logger middleware for nodejs
app.use(morgan('common'));

// ejs : embedded javascript template
// setting the view engine to ejs
app.set('view engine', 'ejs')

app.listen(PORT, ()=>console.log("connected on port "+PORT));