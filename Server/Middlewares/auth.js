const jwt = require("jsonwebtoken");
require("dotenv").config();
exports.auth = async (req,res,next) => {
    try{

        const {token} = req.cookies;
        console.log("my token:",token);
        if(!token){
            return res.status(401).json({
                success : false,
                message : "token is not valid..."
            })
        }
   
        try{
            console.log("SECRET_KEY : ",process.env.SECRET_KEY);
            const payload = jwt.verify(token,process.env.SECRET_KEY);
            req.user=payload;

        }
        catch(error){
            return res.status(401).json({
                success : false,
                message : "error while verifying the token"

                
            })
        }        
        next();


    }

    catch(error){
        return res.status(500).json({
            success : false,
            message : 'error while dealing with token...'
        })

    }
}

