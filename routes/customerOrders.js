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

const proccessData = (response,results,totalNumber) =>{
    const productList = new Array  
    return new Promise(async(resolve,reject) =>{
    for(let u =0;u < totalNumber; u++){
        const getObjectParams = 
        {  Bucket: bucketName,
          Key: results.rows[u].imgid, 
      }
      let x = u+1
      
          const command = new GetObjectCommand(getObjectParams);
         const productUrl = await getSignedUrl(s3, command,{ expiresIn: 3600});
        const product = new orderCard(results.rows[u].imgid,productUrl,response.products['name_'+x],response.products['Qty_'+x],response.products['Price_'+x])
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
    resolve(JSON.stringify(orderObj))    
})
}

    

const perOrder_Query = (product_ids) => {
    return new Promise((resovle,reject) =>{
        pool.query(`SELECT imgid FROM products WHERE id in (${product_ids}) `,(err,results)=>{
            if(err){
                console.log("error message " + err)
                reject(err) 
            }
            resovle(results)
          
        
            }) 

    })
}

const orderCards_Query = (response) => {
    return new Promise(async(resolve,reject) =>{
       const orderList = new Array
        for(let y = 0; y<response.rowCount;y++){

            const productsArr = Object.keys(response.rows[y].products)
            const products_id = new Array;  
             
            let totalNumber = 0
                  for(let i= 1; i <=productsArr.length/4; i++){
                      products_id.push(response.rows[y].products["id_"+i])
                      totalNumber++;
                      
                  }
        const perOrder = await perOrder_Query(products_id)
        const order = await proccessData(response.rows[y],perOrder,totalNumber)
        orderList.push(order)
        
        
        
        }
        resolve(orderList)
    })
  
    

   
}


const orders_Query = (stripe_id)=> {
    return new Promise((resolve,reject) =>{
        pool.query(`SELECT * FROM orders WHERE stripe_user_id = $1 AND order_status_received = $2`, [stripe_id,true],async(err,response) =>{
            if(err){
                console.log("err message " + err)
                reject(err)
            }
            resolve(response)
        })
    })
}


 
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
   
    if(!req.user.id){
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