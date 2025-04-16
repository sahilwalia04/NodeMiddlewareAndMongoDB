const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
   
    name: String,
    email : {type : String, unique: true ,required: true},
    password : {type : String, required: true , minlength : 6},
    age: {type: Number, min: 18, max: 65},
    date: {type: Date, default: Date.now},
})

const UserModel = mongoose.model('User', userSchema);
module.exports = UserModel;