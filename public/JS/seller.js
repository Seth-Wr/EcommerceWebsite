const section = document.querySelector('.product-container');
const sections = [];
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
    for(let i=0; i < data.length; i++){
            const url = data[i].imgUrl;
            const desc = data[i].description;
            const brand = data[i].brand;
            const price = data[i].price;
            const imgId = data[i].imgId
            const category= data[i].category
            const sold_out = data[i].sold_out
            createSection(url,desc,brand,price,imgId,category,sold_out);
    }
    const html = sections.toString()
    const finalhtml = html.replace(/,/g, "") 
    section.innerHTML = finalhtml;
    loader.style.display = "none";
}



const createSection = (url,desc,brand,price,imgId,category,sold_out) =>{
    let sold_out_data = ""
    if(sold_out == true){
            sold_out_data = `<div class="sold_out_text">sold out</div>`
    }
    const cards = new String(`
    <div class="product-card">
        <div class="product-image">
        <a href="editProduct.html?imgId=${imgId}">
            <img src="${url}" class="product-thumb" alt="">
                ${sold_out_data}
            <button class="card-btn">edit product</button>
            </a>
            
        </div>
        
        <div class="product-info">
        <div>
            <h2 class="product-brand">${brand}</h2>
            <p class="product-short-des">${desc}</p>
            <p class="product-category">${category}</p>
            <span class="price">${price}</span>
            </div>
        </div>
        </div>
    `)
  sections.push(cards)
}
const startFunction = () =>{
    fetch('/allproducts')
    .then((res) => res.json())
    .then((res) => processData(res))
    .catch(err => { loader.style.display = "none"; showAlert("Failed to load")});};
    

    
    startFunction()
