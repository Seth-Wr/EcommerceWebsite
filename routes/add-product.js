const router = require('express').Router();
const dotenv = require('dotenv');
const multer = require('multer');
const crypto = require('crypto');
const { PutObjectCommand} = require("@aws-sdk/client-s3");
const {pool} = require("../db")
const {s3} = require("../aws")
dotenv.config()
const bucketName = process.env.bucketName
const randomImageName = (bytes = 32) => crypto.randomBytes(bytes).toString('hex');
const {authSeller} = require('../authSeller')
const storage = multer.memoryStorage();
const upload = multer({storage: storage});


router.post('/', authSeller,upload.array('files'),async(req, res) =>{
    let imageNames = new Array; 

    for(i = 0; i<req.files.length; i++){
    req.files.buffer
    const imageName = randomImageName()
    const params = {
        Bucket: bucketName,
        Key: imageName,
        Body: req.files[i].buffer,
        ContentType: req.files[i].mimetype,
        
         
    }
    imageNames.push(imageName)
    const command = new PutObjectCommand(params)
    await s3.send(command)
}
  let insertQuery = `insert into products(imgID, description, brand, price,category,short_description,sale_price,sizes_s,sizes_m,sizes_l)values('${imageNames[0]}','${req.body.description}', '${req.body.brand}', '${req.body.price}','${req.body.category}','${req.body.short_description}','${req.body.sale_price}','${req.body.sizes_s}','${req.body.sizes_m}','${req.body.sizes_l}')`
    pool.query(insertQuery, (err, response) =>{
            if(!err){
                let insertQuery = `insert into product_pictures(img1ID, img2ID, img3ID, img4ID)values('${imageNames[0]}','${imageNames[1]}', '${imageNames[2]}', '${imageNames[3]}')`
                pool.query(insertQuery, (err, response) =>{
                        if(!err){
                            
                        }
                        else{
                            console.log(err.message)
                        }
                })
                console.log(req.body)
                console.log(imageNames)
                res.sendStatus(201)
            }
            else{
                console.log(err.message)
            }
    })
    
})



module.exports = router;