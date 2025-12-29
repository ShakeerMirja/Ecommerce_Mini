const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    firstname : {
        type : String,
        required : true,
        trim : true,
    },
    lastname : {
        type : String,
        required: true,
        trim : true,
    },
    email : {
        type : String,
        required: true,

    },
    password : {
        type : String,
        required : true,
    },
    products : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'products'
        
    }],
    profilepic : {
        type : String,
        
    }
});


module.exports = mongoose.model("User",userSchema);
