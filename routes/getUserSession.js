const router = require('express').Router();
const Cart = require("../models/cart")
const {pool} = require("../db")






  router.get('/', async(req,res) =>{
    try {
        if(req.user){
            if(req.user.seller == true){
                return res.sendStatus(204)
            }
            if(!req.session.cartUpdated){
                pool.query(`Select cart from usercart where userid = $1`, [req.user.id],async(err,result) => {
                    try {
                        if(!err){
                            // adds cart items from anynomous session into logged in session
                             const savedCart = new Cart(result.rows[0].cart)
                             if(req.session.cart){
                                 const cart = new Cart(req.session.cart)
                                 for(let id in savedCart.items){
                                     for(i = 0; i < savedCart.items[id].qty; i++){
                                         cart.add(savedCart.items[id].item,savedCart.items[id].item.imgid,savedCart.items[id].size)
                                     }
                                 }
                                 
                                 // sends data to db
                                 const cartJson = JSON.stringify(cart)
                                 pool.query(`update userCart set cart = ('${cartJson}') where userid = '${req.user.id}'`, async(error,response) =>{
                                     if(error){ console.log(error) }
                                 })
                                 
                                 req.session.cartUpdated = true
                                 req.session.cart = cart
                             res.status(202).send(cart)
                             return
                             }else{
                                 const savedCart = new Cart(result.rows[0].cart)
                                 req.session.cartUpdated = true
                                 req.session.cart = savedCart
                             res.status(202).send(req.session.cart)
         
                             }
                             
                         } else {console.log(err)}    
                    } catch (error) {
                        console.error(error)
                    }
                             
                    
                })
            }else{ 
                // if session with cartUpdated is estaiblished 
            const cart = new Cart(req.session.cart ? req.session.cart : {})
            res.status(202).send(cart)
            return
        }
        } // for anynomous users 
        else{
            const cart = new Cart(req.session.cart ? req.session.cart : {})
            res.status(400).send(cart)
            return
        }     
    } catch (error) {
        console.error(error)
    }
   
})


module.exports = router;