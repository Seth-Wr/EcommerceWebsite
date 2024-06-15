const router = require('express').Router();
const dotenv = require('dotenv');
const { pool } = require('../db');
dotenv.config();
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
  const mailOptions = (email,tracking) => {
   return { 
    from: {name: 'seth',
  address: process.env.user
  }, 
  to: [email],
  subject: "Your order Shipped!!",
  text: `Thank you for your purchase Items have been shipped Tracking info 
  ${tracking}` 
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

  router.put('/',(req,res) =>{
    if(!req.body.id){
        res.sendStatus(400)
    }
    const tracking_number = req.body.tracking_number || null;
    pool.query(`UPDATE orders SET order_status_shipped = $1, shipping_address = jsonb_set(shipping_address, '{tracking_number}', '"${tracking_number}"') WHERE payment_id = $2`, [true,req.body.id],(err,result) =>{
        if(!err && result.rowCount>0){
          sendMail(transporter,mailOptions(req.body.email,req.body.tracking_number))
            console.log(result)
        res.sendStatus(200)
           
        }else{
            console.log(err)
            res.sendStatus(400)
            
        }
        
    })
    
  })
  
 
module.exports = router;