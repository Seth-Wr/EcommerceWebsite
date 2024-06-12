const router = require('express').Router();
const { pool } = require('../db');
const { GetObjectCommand } = require("@aws-sdk/client-s3");
const {getSignedUrl} = require("@aws-sdk/s3-request-presigner")
const {s3} = require("../aws")
const Cart = require("../models/cart")
const {orderCard} = require("../models/orderCard")
const dotenv = require('dotenv');

dotenv.config();
const bucketName = process.env.bucketName
//get img id so we can get the presigned url
const perOrder_Query = (product_id) => {
    return new Promise((resovle,reject) =>{
        pool.query(`SELECT imgid FROM products WHERE id =$1`,[product_id],(err,results)=>{
            if(err){
                console.log("error message " + err)
                reject(err) 
            }
            resovle(results.rows[0].imgid)
          })
    })
}

//take data from multiple querys to create a object per order with all the data to send to client
const proccessData = (response) =>{
    const productList = new Array  
    return new Promise(async(resolve,reject) =>{
        const productsArr = Object.keys(response.products)
    for(let u =0;u < productsArr.length/4; u++){
        let x = u+1
        const imgid = await perOrder_Query(response.products['id_'+x])
        const getObjectParams = 
        {  Bucket: bucketName,
          Key: imgid, 
      }
      
      
          const command = new GetObjectCommand(getObjectParams);
         const productUrl = await getSignedUrl(s3, command,{ expiresIn: 3600});
        const product = new orderCard(imgid,productUrl,response.products['name_'+x],response.products['Qty_'+x],response.products['Price_'+x])
        productList.push(product)            
    }  

    const orderObj = {
        all_Products: productList,
        shipping: response.shipping_address,
        payment_id: response.payment_id,
        order_price: response.order_price,
        date: response.date_time,
        order_status_shipped: response.order_status_shipped
    } 
    resolve(orderObj)    
})
}

    

//make a obj for each order then return array
const orderCards_Query = (response) => {
    return new Promise(async(resolve,reject) =>{
       const orderList = new Array
        for(let y = 0; y<response.rowCount;y++){
      
        const order = await proccessData(response.rows[y])
        orderList.push(order)
        
        
        }
        resolve(orderList)
    })
}

//use the stripe id to find all orders associated with user
const orders_Query = (stripe_id)=> {
    return new Promise((resolve,reject) =>{
        pool.query(`SELECT * FROM orders WHERE stripe_user_id = $1 AND order_status_received = $2 ORDER BY date_time DESC`, [stripe_id,true],async(err,response) =>{
            if(err){
                console.log("err message " + err)
                reject(err)
            }
            resolve(response)
        })
    })
}


 // use session id in our records to find the stripe id created for user
const stripe_id_Query = (member_id) => {
    return new Promise((resvole,reject) =>{
        pool.query(`SELECT stripe_id FROM test where member_id = $1`, [member_id],(err,result) =>{
            if(err){
                console.log("err message " + err)
                reject(err)
            }
            const  stripe_id = result.rows[0].stripe_id;
            resvole(stripe_id)           
    })
})
}



router.get("/", async(req,res) =>{  
   
    if(req.user == null || !req.user){
        res.sendStatus(402)
        return
    }

  const stripe_id = await stripe_id_Query(req.user.id)
  const orders = await orders_Query(stripe_id)      
  const orderCards = await orderCards_Query(orders)
  res.status(200).send(orderCards)
  console.log("you awaited the list"+orderCards) 

})



module.exports = router