const express = require("express");
const app = express();
const fileupload = require("express-fileupload");
const cookieParser = require("cookie-parser");
const {connectdb} = require('./Config/database');
const {cloudinaryConnect} = require('./Config/cloudinary');

//Routers......
const Auth = require('./Routers/Auth');
const Product = require('./Routers/Product');

require("dotenv").config();
app.use(express.json());
app.use(fileupload({
    useTempFiles : true,
    tempFileDir : '/tmp/'
}))
app.use(cookieParser());
const port = process.env.PORT || 4000;
connectdb();
cloudinaryConnect();


app.use('/api/v1/auth',Auth);
app.use('/api/v1/product',Product);

app.get('/', (req,res) => {
    return res.status(200).json({
        success: true,
        message: "wel-come to Home page"
    })
})

app.listen(port,() => {
    console.log(`server is running at port number ${port}`);
});



