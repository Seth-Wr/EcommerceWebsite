const router = require('express').Router();
const dotenv = require('dotenv');
dotenv.config();
const stripeKey = process.env.stripeKey;
const cart = require('../models/cart')
const stripe = require('stripe')(stripeKey);


router.post('/',async (req, res) => {
  const userCart = new cart(req.session.cart)
   const checkoutCart = new Map()
   const arr = new Array
  let i =1
  for(let id in userCart.items){
    
      checkoutCart.set(i,{price: userCart.items[id].item.price * 100, 
        name: userCart.items[id].item.short_description,
        imgUrl: req.body[id],
        totalQty: userCart.items[id].qty })
      i++;
  }
  checkoutCart.forEach((item,i) =>{
        
    return arr.push({
        price_data:{
            currency: 'usd',
            product_data:{
                name: item.name,
                images: [item.imgUrl]
            },
            unit_amount: item.price
        },
        quantity: item.totalQty
    })
  })
   
    const session = await stripe.checkout.sessions.create({ 
      payment_method_types: ["card","afterpay_clearpay","amazon_pay","cashapp","klarna"],
      shipping_address_collection:{
        allowed_countries:
       ['US']},
      billing_address_collection: 'auto',
      line_items: arr,
      mode: 'payment',
      success_url: `http://localhost:3000/success.html`,
      cancel_url: `http://localhost:3000/userCart.html`,
    });
    res.json({url: session.url});  
  }); 
  module.exports = router;