
const User = require('../Models/User');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookie = require("cookie-parser");
const { default: mongoose } = require('mongoose');
const {uploadImageToCloudinary}= require('../Util/imageUploader');
require("dotenv").config();
exports.SignUp = async (req,res) => {
    try{

        const {firstname ,lastname,email,password,confirmPassword} = req.body;
        const {profilepic} = req.files;
   

        if(!firstname || !lastname || !email || !password || !confirmPassword || !profilepic){
            return res.status(400).json({
                success : false,
                message : "user Fields are missing"
            })
        }
        

        if(password !== confirmPassword){
            return res.status(400).json({
                success: false,
                message : "password and confirm passwords are not matching"
            })
        }
        
        const existUser = await User.findOne({email});

        if(existUser){
            return res.status(400).json({
                success: false,
                message : "User Details already exist,Please Login"
            })
        }
        

        const hashedPassword = await bcrypt.hash(password,10);
        console.log("cloudname :",process.env.CLOUD_NAME);

        const imgres = await uploadImageToCloudinary(profilepic,process.env.CLOUD_NAME);
        console.log(imgres);

        const userDetail = await User.create({
            firstname,lastname,email,
            password : hashedPassword,
            profilepic : imgres.secure_url
        });
        

        return res.status(200).json({
            success: true,
            userDetail,
            message : "user registered successfully",
        });

    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success : true,
            message : "Error occured while registering......"
        });

    }


    
}



exports.SignIn = async (req,res) => {
    try{

        const {email,password} = req.body;

        if(!email || !password){
            return res.status(400).json({
                success: false,
                message : 'Fields are missing....'
            })
        }

        const user = await User.findOne({email});
        if(!user){
            return res.status(401).json({
                success : false,
                message : "user is not exist in database,kindly register..."
            })
        }


        if(await bcrypt.compare(password,user.password)){
            const payload = {
                userId : user._id,
                email : user.email,
                 
            }


            const token = await jwt.sign(payload,process.env.SECRET_KEY,{
                                                                            expiresIn : "2h"
                                                                        }

            );
            user.token = token;
            user.password = undefined;

            const options = {
                expiresIn: new Date(Date.now() + 3*24*60*60*1000),
                httpOnly : true,
            }
            

            return res.cookie("token",token,options).status(200).json({
                success: true,
                user,
                token,
                message : "user logged IN successfully..."
            })



            

        }
        else{
            return res.status(401).json({
                success: false,
                message : "password is incorrect..."
            })
        }
        


    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success : true,
            message : "Error occured while registering......"
        });

    }
}


exports.getUserDetails = async (req,res) => {
    try{
        const  userId = req?.user?.userId;
        console.log("user_id is :",userId);
        if(!userId){
            return res.status(401).json({
                success : true,
                message : 'user id is not valid'

            })
        }
        const user = await User.findById(userId).populate("products").exec();
        return res.status(200).json({
            success : true,
            user,
            message : 'user details are fetched successfully'



        })

    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success : false,
            message : "Error occured while retrieving the user data......"
        });

    }
}



exports.getAllProducts = async(req,res) => {
    try{
        const userId = req?.user?.userId;
        console.log("user Ids : ",userId);
        if(!userId){
            return res.status(401).json({
                success : false,
                message : "userId field is missing",
            })
        }
        const user = await User.findById(userId);
        console.log(user);
        const allProducts = await User.aggregate([
            {$match : {_id : new mongoose.Types.ObjectId(userId)}},
            {$unwind : "$products"},
            {$lookup : {
                from : "products",
                localField : "products",
                foreignField : "_id",
                as : "productDetails",
            }},
            {$unwind : "$productDetails"},
            {$project : {_id : 0 ,productDetails : 1}}

         
        ]);


        return res.status(200).json({
            success : true,
            message : "products fetched successfully",
            allProducts
        })

    }
    catch{
        return res.status(500).json({
            success : false,
            message : "Error occured while retrieving the all product data......"
        });
    }
}



