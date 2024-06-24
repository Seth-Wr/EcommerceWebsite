const router = require('express').Router();
const dotenv = require('dotenv');
const {pool} = require("../db")
const {authSeller} = require("../authSeller")
dotenv.config()

router.put('/',authSeller, async(req, res) =>{
    try {
        const imgId = req.query.imgId
        const sold_out = req.query.sold_out
        const query = new Promise((resolve, reject) => {
            let insertQuery = `Update products set sold_out = ${sold_out} where imgid = '${imgId}'`
            pool.query(insertQuery, async (err, response) =>{
                if(!err){
                  
                    
                    res.sendStatus(201)
                    resolve(response)
                    
                }
                else{
                    reject(err)
                    console.log(err.message)
                    res.sendStatus(400)
                }
        })
        } )  
    } catch (error) {
        console.error(error)
    }
    
    
})
module.exports = router;