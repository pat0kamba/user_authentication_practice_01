const mongoose = require('mongoose');

const {Schema} = mongoose;

const userSchema = new Schema({
    username:{
        type:String,
        minlength:8,
        trim:true,

    },
    password:{
        type:String,
        minLength:4,
        required:true,
    }
},
{
    timeStamps:true
});

module.exports = mongoose.model('User', userSchema);