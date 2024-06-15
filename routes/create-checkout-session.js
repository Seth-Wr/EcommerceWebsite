const router = require('express').Router();
const dotenv = require('dotenv');
const { pool } = require('../db');
dotenv.config();
const stripeKey = process.env.stripeKey;
const cart = require('../models/cart')
const stripe = require('stripe')(stripeKey);


router.post('/',async (req, res) => {
  // first map is for the line items we will pass to stripe the second is for the metadata we will pass to stripe
  const userCart = new cart(req.session.cart)
  const checkoutCart = new Map()
  const metadata_Map = new Map()
  // arr is what will be passed as line items in the checkout session
  const arr = new Array
 let i =1
 // loop through the cart to create the map
 for(let id in userCart.items){  
     checkoutCart.set(i,{price: userCart.items[id].item.price * 100, 
       name: userCart.items[id].item.short_description,
       imgUrl: req.body[userCart.items[id].item.imgid],
       totalQty: userCart.items[id].qty,
       totalPrice: userCart.items[id].price,
       product_id: userCart.items[id].item.id,
       size: userCart.items[id].size
        })
     i++;    }
  //loop through the map to create a arr that is formatted in a way stripe will accept for line items   
 checkoutCart.forEach((item,i) =>{
  // create metadata map to iterate through later
  metadata_Map.set(i,{
    id: item.product_id,
    name: item.name,
    totalQty: item.totalQty.toString(),
   totalPrice: item.totalPrice.toString(),
   size: item.size

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
 //
 const metadataFun = ()=>{
  return new Promise((resolve,reject) =>{
    const  metadataObj = {}
    metadata_Map.forEach((item,i) =>{
     
    const key1 = "id_" + i
    const key2 =  "name_" + i
    const key3 =  "Qty_" + i
    const key4 =  "Price_" + i
    const key5 =  "Size_" + i
    
    
        metadataObj[key1] = item.id
        metadataObj[key2] =  item.name
        metadataObj[key3] =  item.totalQty
        metadataObj[key4] =  item.totalPrice
        metadataObj[key5] =  item.size
        
       
   })
   resolve(metadataObj)
  })
}
const data = await metadataFun()

  //check if stripe has a customer created so we can link user login to stripe orders we query the customers metadata of the user id in our database
  if (req.user){
   const customers = await stripe.customers.search({
      query: `metadata[\'userid\']:'${req.user.id}'`,
    });
    // if no row of customer was found we will create one
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

    //anomyous customer
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