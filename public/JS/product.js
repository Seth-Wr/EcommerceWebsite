const productImages = document.querySelectorAll(".product-images img")
const productImageSlide = document.querySelector(".image-slider-img");
const description =  document.querySelector(".des")
const brand = document.querySelector(".product-brand")
const sale_price = document.querySelector(".product-price")
const short_description = document.querySelector(".product-short-des")
const price = document.querySelector(".product-actual-price")
let activeImageSlide = 0;
const myKeysValues = window.location.search;
const urlParams = new URLSearchParams(myKeysValues);
const param1 = urlParams.get('imgId')
const size_Btns = [];
const size_Buttons = document.querySelector(".size_Buttons")
const addToCartBtn = document.querySelector(".cart-btn")
const loader = document.querySelector(".loader-container")
function showAlert(msg){
    let alertBox = document.querySelector('.alert-box');
    let alertMsg = document.querySelector('.alert-msg');
    alertMsg.innerHTML = msg;
    alertBox.classList.add('show');
    setTimeout(() =>{
        alertBox.classList.remove('show');
    }, 1000);
}



const processData = (data) =>{
    
    short_description.textContent = data.short_description
    description.textContent = data.description
    brand.textContent = data.brand
    productImages[0].src = data.img1idurl;
    productImages[1].src = data.img2idurl;
    productImages[2].src = data.img3idurl;
    productImages[3].src = data.img4idurl;
    productImageSlide.src = data.img1idurl;
    if (data.sale_price == null || data.sale_price == 0){
        sale_price.textContent = data.price
    }
    else{
        sale_price.textContent = data.sale_price
        price.textContent = data.price
    }
 
   createButtons(data.sizes_s,data.sizes_m,data.sizes_l)
   loader.style.display = 'none';
}
productImages.forEach((item, i) =>{
    item.addEventListener('click', () => {
        productImages[activeImageSlide].classList.remove('active');
        item.classList.add('active');
        productImageSlide.src = item.src;
        activeImageSlide = i;
    }) 

})


const createButtons = (small, medium, large) =>{
    let sizeInput = false

    if(small == true){
        const button = new String(`
        
        <input type="radio" name="size" class="radio-btn" value="S" checked hidden id="s-size">
        <label for="s-size" class="size-radio-btn">s</label>
        `)
        sizeInput = true;
      size_Btns.push(button)
    } 
    if(medium == true){
        const button = new String(`
        <input type="radio" name="size" class="radio-btn" value="M" hidden id="m-size">
            <label for="m-size" class="size-radio-btn">m</label>     
        `)
        sizeInput = true;
      size_Btns.push(button)
    } 
    if(large == true){
        const button = new String(`    
        <input type="radio" name="size" class="radio-btn"value="L" hidden id="l-size">
        <label for="l-size" class="size-radio-btn">l</label>
        `)
        sizeInput = true;
      size_Btns.push(button)
    } 
    size_Buttons.innerHTML = size_Btns.toString();
    const sizeBtnsLabel = document.querySelectorAll('.size-radio-btn');
    let checkedBtn = 0;
    const sizeBtns = document.querySelectorAll(".radio-btn")
    sizeBtnsLabel.forEach((item, i) => {
    item.addEventListener('click', () => {
        sizeBtnsLabel[checkedBtn].classList.remove('check');
        sizeBtns[checkedBtn].classList.remove('check');
        item.classList.add('check');
        sizeBtns[i].classList.add('check');
        checkedBtn = i; 
     
    })
})    
addToCartBtn.addEventListener('click', () => {
    loader.style.display = 'flex';
    if(sizeInput == true  && !document.querySelector(".radio-btn.check")){
        loader.style.display = "none";
        showAlert('Please pick a Size')


    }
    else if(document.querySelectorAll(".radio-btn")  && document.querySelector(".radio-btn.check")){
      const size =  {size: document.querySelector(".radio-btn.check").value}
        fetch('/addToCart'+myKeysValues,{
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(size)
    
           }).then((res) => res.json()).then((res) => {
           //add qty to the top navbar
            document.querySelector(".badge").textContent = res.totalQty;
            document.querySelector(".mobile_qty").textContent = res.totalQty
            loader.style.display = 'none';
        }).catch(err => {  loader.style.display = 'none'; showAlert('Failed to add to cart')});  
    }
    else{
        //if no size is chosen by seller it uses this option
        const size = {size: "NA"}
        fetch('/addToCart'+myKeysValues,{
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(size)
    
           }).then((res) => res.json()).then((res) => {
           
            document.querySelector(".badge").textContent = res.totalQty;
            document.querySelector(".mobile_qty").textContent = res.totalQty
            loader.style.display = 'none';
        }).catch(err =>  { loader.style.display = 'none'; showAlert('Failed to add to cart')}); 
    }
     
    
   

})
}


const startFunction = () =>{
    fetch('/product_page'+myKeysValues)
    .then((res) => res.json())
    .then((res) => processData(res))
    .catch(err => { loader.style.display = "none"; showAlert("Failed to load")});
    };
    

    
   startFunction()