const router = require('express').Router();
const dotenv = require('dotenv');
const { pool } = require('../db');
dotenv.config();
const nodemailer = require('nodemailer')
const stripeKey = process.env.stripeKey;
const stripeWHKey =  process.env.stripeWHKey;
const stripe = require("stripe")(stripeKey);

//router.use('/webhook', express.raw({ type: 'application/json' })); 
const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // Use `true` for port 465, `false` for all other ports
    auth: {
      user: process.env.user,
      pass: process.env.pass,
    },
  });
  const mailOptions = (email) => {
   return { 
    from: {name: 'seth',
  address: process.env.user
  }, 
  to: [email],
  subject: "You made a purchase on your own Site",
  text: `Thank you for your purchase! Shipping details will be sent after item is out for delivery. Shipping to ` 
  }
  }

  
  
  const sendMail = async (transporter, mailOptions) =>{
    try {
      await transporter.sendMail(mailOptions);
      console.log("email sent")
      
      //change status of order  after email is semt to the user

    } catch (error) {
      console.log(error)
    }
  }
  
  const endpointSecret = stripeWHKey
  router.post('/', (request, response) => {
      let event = request.body;
      // Only verify the event if you have an endpoint secret defined.
      // Otherwise use the basic event deserialized with JSON.parse
      if (endpointSecret) {
        // Get the signature sent by Stripe
        const signature = request.headers['stripe-signature'];
        try {
          event = stripe.webhooks.constructEvent(
            request.body,
            signature,
            endpointSecret
          );
        } catch (err) {
          console.log(`⚠️  Webhook signature verification failed.`, err.message);
          return response.sendStatus(400);
        }
      }
      let eventData 
      let customerEmail 
      let price 
      // Handle the event
      switch (event.type) {
        case 'charge.succeeded':
         //when charge goes through store info in db and send confirmation email about shipping it
        eventData = event.data.object;
         customerEmail = eventData.billing_details.email
         price = parseInt(eventData.amount) /100
          pool.query(`select payment_id from orders where payment_id = $1`, [eventData.payment_intent], (err,res) =>{
            if(!err && !res.rows[0]){
              console.log(eventData)
              pool.query(`insert into orders (payment_id,stripe_user_id,shipping_address,user_email,order_price,payment_method,receipt_url,payment_made)
              values('${eventData.payment_intent}','${eventData.customer}','${JSON.stringify(eventData.shipping)}','${eventData.billing_details.email}','${price}',
              '${eventData.payment_method_details.type}','${eventData.recipt_url}','${eventData.captured}')`, async(err,response) =>{
                if(err){
                  console.log(err)
                  return
                }
                
              await  sendMail(transporter,mailOptions(customerEmail))
             pool.query(`update orders set order_status_received = $1 where payment_id = $2`, [true, eventData.payment_intent], (err, response) => {
                  if (err) {
                    console.log(err);
                    return;
                  }
                  console.log("order recived");
                })
              })
              return
             }
             else if(!err && res.rows[0]){
              pool.query(`update orders set user_email = '${eventData.billing_details.email}', payment_method ='${eventData.payment_method_details.type}' ,receipt_url ='${eventData.recipt_url}',payment_made = '${eventData.captured}',shipping_address = '${JSON.stringify(eventData.shipping)}'  where payment_id = $1`,[eventData.payment_intent],(err,res) =>{
                if(err){
                  console.log(err)
                  return
                }
                
                sendMail(transporter,mailOptions(customerEmail))
              })
                return
             } 
             else(
              console.log(err)
             )
          })
        
          break;
          case 'checkout.session.completed':
          
          eventData = event.data.object;
          console.log("session")
          
          price = parseInt(eventData.amount_total) /100
          pool.query(`select payment_id from orders where payment_id = $1`, [eventData.payment_intent], async(err,res) =>{
            if(!err && !res.rows[0]){
              pool.query(`insert into orders (payment_id,stripe_user_id,shipping_address,order_price,products,user_email)
              values('${eventData.payment_intent}','${eventData.customer}','${JSON.stringify(eventData.shipping_details)}','${price}','${JSON.stringify(eventData.metadata)}',$1)`,['pending'], async(err,response) =>{
                if(err){
                  console.log(err)
                  return
                }
                
                  
                  
                
                
              })
             }
             else if(!err && res.rows[0]){
              console.log(eventData.metadata)
              pool.query(`update orders set products = '${JSON.stringify(eventData.metadata)}' where payment_id = $1`,[eventData.payment_intent],(err,response) =>{
                if(err){
                  console.log(err)
                  return
                }
                
                
              })
              
            
             } 
             else(
              console.log(err)
             )
  
  
          })  
          
          break;
        case 'payment_intent.succeeded':
          const paymentIntent = event.data.object;
         // console.log(`PaymentIntent for ${paymentIntent.amount} was successful!`);
         // console.log(paymentIntent)
          
          // Then define and call a method to handle the successful payment intent.
          // handlePaymentIntentSucceeded(paymentIntent);
          break;
        case 'payment_method.attached':
          const paymentMethod = event.data.object;
          // Then define and call a method to handle the successful attachment of a PaymentMethod.
          // handlePaymentMethodAttached(paymentMethod);
          break;
        default:
          // Unexpected event type
          console.log(`Unhandled event type ${event.type}.`);
      }
    
      // Return a 200 response to acknowledge receipt of the event
      response.sendStatus(200);
    });
  
module.exports = router;