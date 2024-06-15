const router = require('express').Router();
const Cart = require("../models/cart")
const {pool} = require("../db")

router.put('/', async(req,res) =>{
    //img id and size are passed in fecth request when adding to cart
    const productId = req.query.imgId + req.query.size
    
    if(req.session.cart){
    const cart = new Cart(req.session.cart)
    cart.items[productId].qty ++;
    cart.items[productId].price += cart.items[productId].item.price;
    cart.totalQty ++ ;
    cart.totalPrice += cart.items[productId].item.price;
    req.session.cart = cart
    // if user we will update there cart stored in database
    if(req.user){
        const cartJson = JSON.stringify(cart)
        pool.query(`update userCart set cart = ('${cartJson}') where userid = '${req.user.id}'`, (error,response) =>{
            if(!error){
                console.log(response)
                res.status(201).send()
            }
            else{
                console.log(error)
            }
        })
    }else{
        res.status(201).send()
    }

   
    }else{
        res.sendStatus(400)
    }
})


module.exports = router;