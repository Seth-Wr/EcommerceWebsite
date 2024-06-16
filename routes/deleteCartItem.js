const router = require('express').Router();
const Cart = require("../models/cart")
const {pool} = require("../db")

router.delete('/', async(req,res) =>{
    try {
        const productId = req.query.imgId + req.query.size
        if(req.session.cart){
        const cart = new Cart(req.session.cart)
        cart.totalQty -= cart.items[productId].qty;
        cart.totalPrice -= cart.items[productId].price;
        delete cart.items[productId]
        req.session.cart = cart
        if(req.user){
            const cartJson = JSON.stringify(cart)
            pool.query(`update userCart set cart = ('${cartJson}') where userid = '${req.user.id}'`, (error,response) =>{
                if(!error){
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
    } catch (error) {
        console.error(error)
    }
    
})






module.exports = router;