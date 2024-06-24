const router = require('express').Router();
const { response } = require('express');
const { pool } = require('../db');

router.put('/',(req,res) =>{
    if(req.session){
        req.session.cart = {}
        if(req.user){
            try {
                pool.query(`update usercart set cart = '{}'::jsonb where userid = $1`,[req.user.id],(err,response)=>{
                    if(err){
                        console.log(err)
                        return
                    }
                    
                })
            } catch (error) {
                console.error(error)
            }
        }
        res.sendStatus(200)
    }
  
})
module.exports = router