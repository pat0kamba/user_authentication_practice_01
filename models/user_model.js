const mongoose = require('mongoose');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');
const findOrCreate = require('mongoose-findorcreate')
const {Schema} = mongoose;

const userSchema = new Schema({
    username:{
        type:String,
        minlength:5,
        trim:true,
        required:true,
        unique:true

    },
    password:{
        type:String,
        minLength:4,
        unique:true
    }
},
{
    timeStamps:true
});

// insert the passport local mongoose as a plugin
// to hacth the password, store and pick up data from the database
userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);
module.exports = mongoose.model('User', userSchema);