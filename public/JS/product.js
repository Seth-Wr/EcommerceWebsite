const productImages = document.querySelectorAll(".product-images img")
const productImageSlide = document.querySelector(".image-slider");
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



const processData = (data) =>{
    
    short_description.textContent = data.short_description
    description.textContent = data.description
    brand.textContent = data.brand
    productImages[0].src = data.img1idurl;
    productImages[1].src = data.img2idurl;
    productImages[2].src = data.img3idurl;
    productImages[3].src = data.img4idurl;
    productImageSlide.style.backgroundImage = `url('${data.img1idurl}')`;
    if (data.sale_price == null || data.sale_price == 0){
        sale_price.textContent = data.price
    }
    else{
        sale_price.textContent = data.sale_price
        price.textContent = data.price
    }
 
    createButtons(data.sizes_s,data.sizes_m,data.sizes_l)
}
productImages.forEach((item, i) =>{
    item.addEventListener('click', () => {
        productImages[activeImageSlide].classList.remove('active');
        item.classList.add('active');
        productImageSlide.style.backgroundImage = `url('${item.src}')`;
        activeImageSlide = i;
    }) 

})


const createButtons = (small, medium, large) =>{
    if(small){
        const button = new String(`
        
        <input type="radio" name="size" value="s" checked hidden id="s-size">
        <label for="s-size" class="size-radio-btn">s</label>
        `)
      size_Btns.push(button)
    } 
    if(medium){
        const button = new String(`
        <input type="radio" name="size" value="m" hidden id="m-size">
            <label for="m-size" class="size-radio-btn">m</label>     
        `)
      size_Btns.push(button)
    } 
    if(large){
        const button = new String(`    
        <input type="radio" name="size" value="l" hidden id="l-size">
        <label for="l-size" class="size-radio-btn">l</label>
        `)
      size_Btns.push(button)
    } 
    size_Buttons.innerHTML = size_Btns.toString();
    const sizeBtns = document.querySelectorAll('.size-radio-btn');
    let checkedBtn = 0;

    sizeBtns.forEach((item, i) => {
    item.addEventListener('click', () => {
        sizeBtns[checkedBtn].classList.remove('check');
        item.classList.add('check');
        checkedBtn = i; 
     
    })
})
addToCartBtn.addEventListener('click', () => {
    fetch('/addToCart'+myKeysValues,{
        method: 'put',
        headers: {'Content-Type': 'application/json'}
       }).then((res) => res.json()).then((res) => {
       
        document.querySelector(".badge").textContent = res.totalQty;
    
    })
 //  const size_input = document.querySelector(".size-radio-btn.check");
  //  console.log(size_input.textContent)
})
}


const startFunction = () =>{
    fetch('/product_page'+myKeysValues)
    .then((res) => res.json())
    .then((res) => processData(res))
    };
    

    
   startFunction()