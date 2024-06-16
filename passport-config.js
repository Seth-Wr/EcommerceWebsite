const router = require('express').Router();
const passport = require("passport")
const LocalStrategy = require('passport-local')
const {pool} = require('./db')
const bcrypt = require("bcrypt");


passport.use(
    new LocalStrategy(function verify(username,password, done) {
        try {
            pool.query( `SELECT * FROM test WHERE emails = $1`, [username],async (err, results)=>{
                if (err){
                    throw err;
                }

                if(results.rows.length > 0){
                    const user = results.rows[0];
                    if (await bcrypt.compare(password, user.passwords)){
                        return done(null, user)
                   }else{
                        return done(null, false, {message: "Password is inncorrect"})
                       }
                }else{
                    return done (null, false, {message: "Email is not registered"})
                }
            })
            
        } catch (error) {
            done(err,null)
        }
    })
)

    passport.serializeUser((user,done)=>done(null, user.member_id));
    passport.deserializeUser((user, done) =>{
        pool.query(`SELECT member_id, emails,sellers FROM test WHERE member_id = $1`,[user],(err, results)=>{
            if(err){
                throw err
            }
            userObj = {id: results.rows[0].member_id, email: results.rows[0].emails, seller: results.rows[0].sellers}
            return done(null,userObj)
        })
    })
   

    router.post('/', passport.authenticate('local',{
        successRedirect:"/",
        failureRedirect:"/login",
        keepSessionInfo: true
    })       
    )
   
    module.exports = router;