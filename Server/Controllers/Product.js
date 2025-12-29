const products = require("../Models/Products");
const User = require("../Models/User");
require("dotenv").config();
const mongoose = require("mongoose");
const { uploadImageToCloudinary } = require("../Util/imageUploader");

exports.addProduct = async (req,res) => {
    try{
        const {name,price,category,quantity,desc} = req.body;
        const  userId = req?.user?.userId;
        const {productpic} = req.files;

        console.log("userid : ",userId);
        if(!userId || !name || !price || !category || !quantity || !desc){
            return res.status(400).json({
                success : false,
                message : "Fields are missing..."
            })
        }
        const imageres  = await uploadImageToCloudinary(productpic,process.env.CLOUD_NAME);
        console.log(imageres);
        const productdetails = await products.create({name,price,category,
            quantity,desc,
            productpic : imageres.secure_url
        
        });

        await User.findByIdAndUpdate(userId, {$push : {products : productdetails._id}},{new : true});

        return res.status(200).json({
            success : true,
            productdetails,
            message : "product created successfully"
        })
                                        

    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success : false,
            message : "Error occured while adding the product......"
        });

    }
}



exports.getProduct = async(req,res) => {
    try{

        const {productId} = req.params;
        console.log("product id:",productId);
        if(!productId){
            return res.json({
                success: false,
                message:'productId is undefined...'
            })
        }

        const product =await Products.findById(productId);

        return res.status(200).json({
            success : true,
            message : 'product details fetched successfully',
            product
        })

    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success : false,
            message : "Error occured while fetching the product......",
        });

    }
    
}


exports.getAllProducts = async(req,res) => {
    try{

        

        const allproducts =await Products.find();

        return res.status(200).json({
            success : true,
            message : 'product details fetched successfully',
            allproducts
        })

    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success : false,
            message : "Error occured while fetching the all the products......",
        });

    }
    
}



exports.updateProduct = async(req,res) => {
    try{

        const {productId} = req.params;
        console.log("productid: ",productId);
        const updates = req.body;
        const product = await Products.findById(productId);
        Object.entries(updates).forEach(([key,value]) => {
            product[key] = value;
        });
        
        await product.save();


        return res.status(200).json({
            success : true,
            message : 'product updated successfully...',
            product
        })

    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success : false,
            message : "Error occured while updating the product......",
        });

    }
    
}




exports.deleteProduct = async(req,res) => {
    try{

        const {userId} = req.user.userId;
        const {productId} = req.params;
        console.log("U:",userId);
        console.log("Productid: ",productId);
        if(!productId){
            return res.json({
                success: false,
                message:'productId is undefined...'
            })
        }
        const product  = await Products.findById(productId);
        await Products.deleteOne({_id : new mongoose.Types.ObjectId(productId)});
        await User.findByIdAndUpdate(userId,
                                {$pull : {products : productId}},{new : true}
        );
        
        return res.status(200).json({
            success : true,
            message : 'product updated successfully...',
            product
        })

    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success : false,
            message : "Error occured while deleting  the product......",
        });

    }
    
}
