const router = require('express').Router();
const dotenv = require('dotenv');
const {s3} = require("../aws")
const { GetObjectCommand} = require("@aws-sdk/client-s3");
const {getSignedUrl} = require("@aws-sdk/s3-request-presigner")
const {cartProductCard} = require("../models/cartProductCard")
const Cart = require("../models/cart")
dotenv.config()
const bucketName = process.env.bucketName


router.get("/", async(req,res) =>{
    const cartList = new Array;
    if(!req.session.cart){
        res.sendStatus(402)
        return
    }
    
    const cart = new Cart(req.session.cart)
    const cartArr = cart.generateArray()
    
    for(let i =0;i < cartArr.length; i++){
        const getObjectParams = 
        {  Bucket: bucketName,
          Key: cartArr[i].item.imgid, 
      }
          const command = new GetObjectCommand(getObjectParams);
         const productUrl = await getSignedUrl(s3, command,{ expiresIn: 3600});
         const product = new cartProductCard(cartArr[i].item.imgid,productUrl,cartArr[i].item.short_description,cartArr[i].price,cartArr[i].qty,cartArr[i].item.price,cartArr[i].size,cartArr[i].item.sale_price);
         
         cartList.push(product)
            


    }  
    
    console.log(cartList)
    res.status(200).send(cartList)
})











module.exports = router;