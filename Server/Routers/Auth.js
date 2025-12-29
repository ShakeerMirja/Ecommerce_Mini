const express = require("express");
const router  = express.Router();
const {auth} = require("../Middlewares/auth");
const {SignUp,SignIn,getUserDetails,getAllProducts} = require('../Controllers/Auth');

router.post('/signup',SignUp);
router.post('/signin',SignIn);
router.get('/getuser',auth,getUserDetails);
router.get('/getallproducts',auth,getAllProducts);
module.exports = router;
