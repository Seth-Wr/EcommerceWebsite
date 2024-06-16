const dotenv = require('dotenv');
dotenv.config();
const stripe = require('stripe')(process.env.stripeKey)
const { pool } = require('./db');
const nodemailer = require('nodemailer')



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

  const mailOption_Alert = (event) => {
    return { 
     from: {name: 'seth',
   address: process.env.user
   }, 
   to: ['sethwrighttech@gmail.com'],
   subject: "Refunds and Disputes",
   text: `Keeping you up to date with unwanted events such as Refunds 
    ${event}` 
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

const order_Not_Found = async(event) =>{
    return new Promise((resolve,reject) =>{
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
                    reject(err)
                  }
                  
                await  sendMail(transporter,mailOptions(customerEmail))
               pool.query(`update orders set order_status_received = $1 where payment_id = $2`, [true, eventData.payment_intent], (err, response) => {
                    if (err) {
                      console.log(err);
                      reject(err)
                    }
                  resolve("Order received")  
                  })
                })
                
               }
               else if(!err && res.rows[0]){
                pool.query(`update orders set user_email = '${eventData.billing_details.email}', payment_method ='${eventData.payment_method_details.type}' ,receipt_url ='${eventData.recipt_url}',payment_made = '${eventData.captured}',shipping_address = '${JSON.stringify(eventData.shipping)}'  where payment_id = $1`,[eventData.payment_intent],async(err,res) =>{
                  if(err){
                    console.log(err)
                    reject(err)
                  }
                  console.log("sending mail")
                 await sendMail(transporter,mailOptions(customerEmail))
                 pool.query(`update orders set order_status_received = $1 where payment_id = $2`, [true, eventData.payment_intent], (err, response) => {
                    if (err) {
                      console.log(err);
                      reject(err)
                    }
                  resolve("Order received")  
                  })
                })
                  
               } 
               else(
                reject(err)
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
                    reject(err)
                  }
                  
                    resolve("Checkout Session recived")
                    
                  
                  
                })
               }
               else if(!err && res.rows[0]){
                
                pool.query(`update orders set products = '${JSON.stringify(eventData.metadata)}' where payment_id = $1`,[eventData.payment_intent],(err,response) =>{
                  if(err){
                    console.log(err)
                    reject(err)
                  }
                  
                  resolve("Checkout Session recived")
                    
                })
                
              
               } 
               else(
                
                    reject(err)
               )
    
    
            })  
            
            break;
            default:
            // Unexpected event type
            console.log(`Unhandled Error.`);
            reject('unhandled error')
        }
    })
}

const orderExist_Query = (payment_id) =>{
    return new Promise((resolve,reject) =>{
        pool.query(`SELECT payment_id,order_status_received,products FROM orders WHERE payment_id = $1`,[payment_id],(err,result)=>{
            if(err){
                reject(err)
            }
            
            resolve(result)
        })
    })
}

const display_Stripe_Events = async()=>{
    const events = await stripe.events.list({
        types: ['checkout.session.completed','charge.succeeded'],
      });
      for(i = 0; i < events.data.length; i++){
        const payment_id = events.data[i].data.object.payment_intent
        const query = await orderExist_Query(payment_id)
        
        if(query.rowCount < 1 ){
            console.log("rowcount below 1")
           await order_Not_Found(events.data[i])
        

        }
        else if(query.rows[0].order_status_received == false){
            console.log("order status not recieved")
          await  order_Not_Found(events.data[i])
        }
        else if(query.rows[0].products == null){
            console.log("products are null")
          await  order_Not_Found(events.data[i])
        }
        else{ console.log("All up to date")}
      }
    
    
}
const display_Stripe_Fraud = async()=>{
  const events = await stripe.events.list({
    types: ['charge.dispute.created','charge.refunded','radar.early_fraud_warning.created','refund.created'],
  });
  if(events.data.length > 0){
    const event = JSON.stringify(events.data)
    sendMail(transporter,mailOption_Alert(event))
  }else{ console.log("no issues")}
}

const setInterval_Payment = () =>{
  try {
    setInterval(display_Stripe_Events,900 * 1000)
  } catch (error) {
    console.error(error)
  }
   
}
const setInterval_Fraud = () =>{
  try {
    setInterval(display_Stripe_Fraud,86400 *1000)
  } catch (error) {
    console.error(error)
  }
   
}


module.exports = {setInterval_Payment, setInterval_Fraud}