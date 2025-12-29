const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
        trim : true
    },
    category : {
        type : String,
        required : true,
        trim : true,
    },
    price : {
        type : Number ,
        required : true,
    },
    quantity : {
        type : String,
        required : true,
    },
    description : {
        type : String,
    },
    image : {
        type : String,
    }

});

module.exports = mongoose.model("products",productSchema);
