const express = require("express");
const router  = express.Router();
const {auth} = require("../Middlewares/auth");
const {getProduct,addProduct,deleteProduct,updateProduct,getAllProducts} = require('../Controllers/Product');


router.post('/addproduct',auth,addProduct);
router.get('/getproduct/:productId',getProduct);
router.get('/getallproducts',auth,getAllProducts)
router.delete('/deleteproduct/:productId',auth,deleteProduct);
router.put('/updateproduct/:productId',updateProduct);

module.exports = router;
