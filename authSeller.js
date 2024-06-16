const passport = require("passport");
const {pool} = require("./db")

function authSeller(req,res,next){
            if(req.user.seller ==true){
                
                return next();
            }else{
               return res.send("Not allowed in Seller Portal on a non seller account")
    
}
}

function sellerLogin(req,res,next){
    if(req.user){
        if(req.user.seller == true){
            return res.redirect('/seller')
        }
        else{
            return next()
        }
        
    }
else{
    return next();
}
}
function checkAuthenticated(req, res,next){
    if(req.isAuthenticated()){
        return res.redirect("/")
    }
    next();
}
function checkNotAuthenticated(req, res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/login')
}

module.exports = {authSeller, checkAuthenticated, checkNotAuthenticated, sellerLogin};