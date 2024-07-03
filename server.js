const express = require('express');

const dotenv = require('dotenv');
dotenv.config();

const path = require('path');
const crypto = require('crypto')
const session = require('express-session');

// routes
const homepage_Route = require('./routes/homepage')
const checkout_Route = require('./routes/create-checkout-session')
const product_Page_Route = require("./routes/product_page")
const all_Products_Route = require("./routes/allproducts")
const products_Route = require("./routes/products")
const sold_out_Product_Route = require("./routes/sold_out_product")
const signup_Route = require("./routes/signup")
const add_Product_Route = require("./routes/add-product")
const editText_Route = require("./routes/editText")
const editProductImg_Route = require("./routes/editProductImg");
const addToCart_Route = require("./routes/addToCart")
const shoppingCart_Route = require("./routes/shoppingCart")
const deleteCartItem_Route = require("./routes/deleteCartItem")
const addQtyCart_Route = require("./routes/addQtyCart")
const deleteQtyCart_Route = require("./routes/deleteQtyCart")
const logout_Route = require("./routes/logout")
const inputChangeCart_Route = require("./routes/inputChangeCart")
const getUserSession_Route = require("./routes/getUserSession")
const customerOrders_Route = require("./routes/customerOrders")
const sellersOrders_Route = require("./routes/sellersOrders")
const Stripe_webhooks = require("./routes/Stripe_webhooks")
const shipOrder_Route = require("./routes/shipOrder")
const deleteCart_Route = require("./routes/deleteCart")
const getShoppingCartQty_Route = require('./routes/getShoppingCartQty')
const passport_Route = require("./passport-config");
const passport = require('passport');

//checking webhook functions created in another file
const {setInterval_Payment,setInterval_Fraud} = require('./Stripe_webhooks_check')

//custom middlewars
const {authSeller, checkAuthenticated,checkNotAuthenticated,sellerLogin} = require('./authSeller');
//postgres connections
const { pool } = require('./db');
const pgSession = require('connect-pg-simple')(session)
const sessionSecret = process.env.sessionSecret
const sessionName = process.env.sessionName

const sessionConfig = {
    store: new pgSession({
        pool: pool,
        tableName: 'session'
    }),  genid: function (req){
        return crypto.randomUUID();
    },
    name: sessionName,
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60  * 60 * 24 * 7,
        sameSite: true,
        secure: false // ENABLE ONLY ON HTTPS
    }}
//expressjs library
const app = express();

// static path
let staticPath = path.join(__dirname, "public");
//middlewares


app.use('/webhook',express.raw({ type: 'application/json' }), Stripe_webhooks)

app.use(express.json());
//app.use(bodyParser.json());
app.use(session(sessionConfig));
app.use(passport.authenticate('session'));
app.use(express.static(staticPath));


//local static routes
app.get("/",(req, res) => {

    res.sendFile(path.join(staticPath, "index.html"));   })

app.get('/search', sellerLogin,(req, res) => {
    
  res.sendFile(path.join(staticPath, "search.html")); })

app.get('/signup',sellerLogin, checkAuthenticated,(req, res) =>{
    res.sendFile(path.join(staticPath, "signup.html"));  })

app.get('/login',sellerLogin, checkAuthenticated,(req, res) =>{
    res.sendFile(path.join(staticPath, "login.html"));}
    )
app.get('/add-product', checkNotAuthenticated,authSeller,(req, res) => {
    res.sendFile(path.join(staticPath, "addProduct.html")); })

app.get('/editProduct', checkNotAuthenticated,authSeller,(req,res)=>{
    res.sendFile(path.join(staticPath, "editProduct.html")) })

 app.get('/success',(req,res)=>{
        res.sendFile(path.join(staticPath, "success.html")) })
 
 
app.get('/product',sellerLogin, (req, res) => {
    res.sendFile(path.join(staticPath, "product.html"));  })

app.get('/userCart',sellerLogin, (req, res) => {
    res.sendFile(path.join(staticPath, "userCart.html"));  })
    
app.get('/seller', checkNotAuthenticated,authSeller,(req, res) =>{
    res.sendFile(path.join(staticPath, "seller.html"));
        })

app.get('/userOrders',sellerLogin, checkNotAuthenticated, (req, res) => {
        res.sendFile(path.join(staticPath, "userOrders.html"));  })

app.get('/sellerOrders',  checkNotAuthenticated,authSeller,(req, res) => {
    res.sendFile(path.join(staticPath, "sellerOrders.html"));  })

//routes
app.use('/create-checkout-session', checkout_Route)
app.use('/add-product', authSeller,add_Product_Route)
app.use('/products', products_Route)
app.use('/product_page', product_Page_Route)
app.use('/allproducts', all_Products_Route)
app.use('/sold_out_product', authSeller,sold_out_Product_Route)
app.use('/signup', signup_Route)
app.use('/editText', authSeller,editText_Route)
app.use('/editProductImg',authSeller, editProductImg_Route)
app.use('/user_login', passport_Route)
app.use('/addToCart', addToCart_Route)
app.use('/shoppingCart', shoppingCart_Route)
app.use('/deleteCartItem', deleteCartItem_Route)
app.use('/addQtyCart', addQtyCart_Route)
app.use('/deleteQtyCart', deleteQtyCart_Route)
app.use('/inputChangeCart', inputChangeCart_Route)
app.use('/getUserSession', getUserSession_Route)
app.use('/logout', logout_Route)
app.use('/customerOrders', customerOrders_Route)
app.use('/sellersOrders', authSeller,sellersOrders_Route)
app.use('/shipOrder',authSeller, shipOrder_Route)
app.use('/getShoppingCartQty',getShoppingCartQty_Route)
app.use('/deleteCart', deleteCart_Route)
app.use('/homepage', homepage_Route)




app.listen(3000, () => {
    console.log('listening on port 3000');})

setInterval_Payment()
setInterval_Fraud()

app.get('/404', (req, res) => {    res.sendFile(path.join(staticPath, "404.html"));
})

app.use((req, res) => {
    res.redirect('/404');})


