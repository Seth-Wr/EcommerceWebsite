const router = require('express').Router();
const Cart = require("../models/cart")
const {pool} = require("../db")



router.put('/', async(req,res) =>{
    try {
        const productId = req.query.imgId + req.query.size
        const inputQty = req.query.inputQty
        
        
        if(req.session.cart){
        const cart = new Cart(req.session.cart)
        if(cart.items[productId].qty < inputQty){
            let difference = inputQty - cart.items[productId].qty
            cart.items[productId].qty += difference 
            cart.items[productId].price += difference * cart.items[productId].item.price 
            cart.totalQty += difference 
            cart.totalPrice += difference * cart.items[productId].item.price 
        }else{
            let difference = cart.items[productId].qty - inputQty
            cart.items[productId].qty -= difference
            cart.items[productId].price -= difference * cart.items[productId].item.price 
    
            cart.totalQty -= difference 
            cart.totalPrice -= difference * cart.items[productId].item.price 
        }
        
        const cartUpdate = {itemQty: cart.items[productId].qty, itemPrice: cart.items[productId].price, totalQty: cart.totalQty, totalPrice: cart.totalPrice}
      
       req.session.cart = cart
       if(req.user){
        const cartJson = JSON.stringify(cart)
        pool.query(`update userCart set cart = ('${cartJson}') where userid = '${req.user.id}'`, (error,response) =>{
            if(!error){
                res.status(201).send(cartUpdate)
            }
            else{
                console.log(error)
            }
        })
    }else{
        res.status(201).send(cartUpdate)
    }
        
        }else{
           res.sendStatus(400)
        }           
    } catch (error) {
        console.error(error)
    }
    
})


module.exports = router;