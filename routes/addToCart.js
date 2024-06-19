const router = require('express').Router();
const Cart = require("../models/cart")
const {pool} = require("../db")


router.put('/',async (req,res) =>{
    try {
         // we will verify that cart item is in our records before adding it
    const productId = req.query.imgId
    //if no cart in session we will pass a undefined object
    const cart = new Cart(req.session.cart ? req.session.cart : {})
    pool.query(`Select imgID, short_description, price, sale_price,id from products where imgID =$1 `, [productId],(err,result) =>{
        if(err){
            console.log(err)
            return err
        }
        //cart add is a function creating in cart file
        cart.add(result.rows[0],result.rows[0].imgid,req.body.size);
        req.session.cart = cart;
        //update users cart in DB or just store in session
        if(req.user){
            const cartJson = JSON.stringify(cart)
            pool.query(`update userCart set cart = ('${cartJson}') where userid = '${req.user.id}'`, (error,response) =>{
                if(!error){
                    console.log(response)
                    res.send(cart)
                    console.log(cart)
                }
                else{
                    console.log(error)
                }
            })
        }else{
            res.send(cart)
        }
       
    })
    } catch (error) {
        console.error(error)
    }
   
})

module.exports = router;