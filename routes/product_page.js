const router = require('express').Router();
const dotenv = require('dotenv');
const { GetObjectCommand} = require("@aws-sdk/client-s3");
const {getSignedUrl} = require("@aws-sdk/s3-request-presigner")
const {pool} = require("../db")
const {s3} = require("../aws")
dotenv.config()
const bucketName = process.env.bucketName

router.get('/', async(req, res) =>{
    try {
        const product = {} ;
        const imgId = req.query.imgId;
        const query = new Promise((resolve, reject) => {
            let insertQuery = `select img1id, img2id, img3id, img4id, description, brand, price, category,short_description,sale_price,sizes_s,sizes_m,sizes_l from products inner join product_pictures on (products.imgid = product_pictures.img1id) where imgid = '${imgId}'`
            pool.query(insertQuery, (err, response) =>{
                if(!err){
                    resolve(response)
                    
                    
                }
                else{
                    reject(err)
                    console.log(err.message)
                }
        })
        } )
       query.then(async(data) => {
            for(let i = 1;i < 5; i++){            
                
                 let num = i.toString(); 
                 let imgkey = "img" + num + "id"
                let imgkeyurl = "img" + num + "id" + "url"
                const getObjectParams = 
                  {  Bucket: bucketName,
                    Key: data.rows[0][imgkey], 
                }
                    const command = new GetObjectCommand(getObjectParams);
                   const productUrl = await getSignedUrl(s3, command,{ expiresIn: 3600});
                product[imgkey] = data.rows[0][imgkey];
                product[imgkeyurl] = productUrl;
                   
                  
                }
                product['description'] = data.rows[0]['description']
                product['brand'] = data.rows[0]['brand']
                product['price'] = data.rows[0]['price']
                product['category'] = data.rows[0]['category']
                product['short_description'] = data.rows[0]['short_description']
                product['sale_price'] = data.rows[0]['sale_price']
                product['sizes_s'] = data.rows[0]['sizes_s']
                product['sizes_m'] = data.rows[0]['sizes_m']
                product['sizes_l'] = data.rows[0]['sizes_l']
            res.send(product);
            
        }).catch((message) => {
            console.log(message)
        })     
    } catch (error) {
        console.error(error)
    }
    
})

module.exports = router;