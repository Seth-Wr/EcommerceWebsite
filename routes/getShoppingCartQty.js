const router = require('express').Router();
const Cart = require("../models/cart")
const {pool} = require("../db")






  router.get('/', async(req,res) =>{
    try {
        if(req.session.cart){
            const qty = {qty: req.session.cart.totalQty}
            res.status(200).send(JSON.stringify(qty))
        }
       else{
        res.sendStatus(400)
       }
    } catch (error) {
        console.error(error)
    }
   
})


module.exports = router;