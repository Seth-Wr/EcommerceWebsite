const router = require('express').Router();
const Cart = require("../models/cart")
const {pool} = require("../db")


router.put('/',async (req,res) =>{
    const productId = req.query.imgId
    const cart = new Cart(req.session.cart ? req.session.cart : {})
    pool.query(`Select imgID, short_description, price, sale_price from products where imgID =$1 `, [productId],(err,result) =>{
        if(err){
            console.log(err)
            return err
        }
        cart.add(result.rows[0],result.rows[0].imgid);
        req.session.cart = cart;
        console.log(req.session.cart)
        console.log(result.rows[0])
        if(req.user){
            const cartJson = JSON.stringify(cart)
            pool.query(`update userCart set cart = ('${cartJson}') where userid = '${req.user.id}'`, (error,response) =>{
                if(!error){
                    console.log(response)
                    res.send(cart)
                }
                else{
                    console.log(error)
                }
            })
        }else{
            res.send(cart)
        }
       
    })
})

module.exports = router;