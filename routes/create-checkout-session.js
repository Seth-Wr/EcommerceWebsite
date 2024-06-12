const router = require('express').Router();
const dotenv = require('dotenv');
const { pool } = require('../db');
dotenv.config();
const stripeKey = process.env.stripeKey;
const cart = require('../models/cart')
const stripe = require('stripe')(stripeKey);


router.post('/',async (req, res) => {
  const userCart = new cart(req.session.cart)
  const checkoutCart = new Map()
  const metadata_Map = new Map()
  const arr = new Array
 let i =1
 for(let id in userCart.items){   
     checkoutCart.set(i,{price: userCart.items[id].item.price * 100, 
       name: userCart.items[id].item.short_description,
       imgUrl: req.body[id],
       totalQty: userCart.items[id].qty,
       totalPrice: userCart.items[id].price,
       product_id: userCart.items[id].item.id
        })
     i++;    }
     
 checkoutCart.forEach((item,i) =>{
  
  metadata_Map.set(i,{
    id: item.product_id,
    name: item.name,
    totalQty: item.totalQty.toString(),
   totalPrice: item.totalPrice.toString()

  })
   return arr.push({
       price_data:{
           currency: 'usd',
           product_data:{
               name: item.name,
               images: [item.imgUrl]
                },
           unit_amount: item.price     },
           
       quantity: item.totalQty  })
 })
 console.log(arr)
 const metadataFun = async()=>{

  const  metadataObj = {}
  metadata_Map.forEach((item,i) =>{
   
  const key1 = "id_" + i
  const key2 =  "name_" + i
  const key3 =  "Qty_" + i
  const key4 =  "Price_" + i
  
  
      metadataObj[key1] = item.id
      metadataObj[key2] =  item.name
      metadataObj[key3] =  item.totalQty
      metadataObj[key4] =  item.totalPrice
      
     
 })
 
return metadataObj
}
const data = await metadataFun()
console.log(data)
  //check if stripe has a customer created so we can link user login to stripe orders
  if (req.user){
   const customers = await stripe.customers.search({
      query: `metadata[\'userid\']:'${req.user.id}'`,
    });
  
    if (!customers.data[0]){
      const newCustomer = await stripe.customers.create({
        metadata: { userid: req.user.id, }  });  
        pool.query(`update test set stripe_id = ('${newCustomer.id}') where member_id = '${req.user.id}'`,async(err,response)=>{
          if(!err){
           
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
            customer: newCustomer.id, 
          metadata: data,
        });
      
          res.json({url: session.url}); 
        return }
      
      else{
        console.log(err)
        return
      }})
    }
    else{
      console.log(" customer exists")
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
        customer: customers.data[0].id, 
        metadata: data,
          
        
      });

      
      console.log(session.metadata)
      res.json({url: session.url}); 
    return }
}
else {

    
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
      metadata: data,
    
      
    });
    
    res.json({url: session.url}); 

}
});


  module.exports = router;