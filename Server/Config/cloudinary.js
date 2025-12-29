const cloudinary = require("cloudinary").v2;
require("dotenv").config();
exports.cloudinaryConnect = () => {
    try{
        cloudinary.config({
            api_key : process.env.API_KEY,
            cloud_name : process.env.CLOUD_NAME,
            api_secret : process.env.SECRET_KEY,
        });

    }
    catch(error){
        console.log("error occured during cloudinary connect:",error);
    }   
}
