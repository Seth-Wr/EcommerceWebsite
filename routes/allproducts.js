const router = require('express').Router();
const dotenv = require('dotenv');
const { GetObjectCommand } = require("@aws-sdk/client-s3");
const {getSignedUrl} = require("@aws-sdk/s3-request-presigner")
const {pool} = require("../db")
const {s3} = require("../aws")
const {ProductCard} = require("../models/productCard")
const {authSeller} = require('../authSeller')
dotenv.config()
const bucketName = process.env.bucketName

router.get('/',authSeller, async(req, res) =>{
    
    const productList = new Array;
    const query = new Promise((resolve, reject) => {
        let insertQuery = `select * from products`
        pool.query(insertQuery, (err, response) =>{
            if(!err){
                resolve(response)
                console.log(response.body)
                
            }
            else{
                reject(err)
                console.log(err.message)
            }
    })
    } )
    query.then(async(data) => {
        for(let i = 0;i < data.rowCount; i++){            
            

            const getObjectParams = 
              {  Bucket: bucketName,
                Key: data.rows[i].imgid, 
            }
                const command = new GetObjectCommand(getObjectParams);
               const productUrl = await getSignedUrl(s3, command,{ expiresIn: 3600});
               const product = new ProductCard(data.rows[i].imgid,productUrl,data.rows[i].description,data.rows[i].brand,data.rows[i].price,data.rows[i].category);
               
               productList.push(product)
              
            }
            console.log(productList)
        res.send(productList);
        
    }).catch((message) => {
        console.log(message)
    })
    })

    module.exports = router;