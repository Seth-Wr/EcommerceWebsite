const section = document.querySelector('.product-container');
const sections = [];


const processData = (data) =>{
    for(let i=0; i < data.length; i++){
            const url = data[i].imgUrl;
            const desc = data[i].description;
            const brand = data[i].brand;
            const price = data[i].price;
            const imgId = data[i].imgId
            const category= data[i].category
            createSection(url,desc,brand,price,imgId,category);
    }
    console.log(sections.toString());  
    section.innerHTML = sections.toString();
}



const createSection = (url,desc,brand,price,imgId,category) =>{
    const cards = new String(`
    <div class="product-card">
        <div class="product-image"><a href="editProduct.html?imgId=${imgId}">
            <img src="${url}" class="product-thumb" alt="">
            <button class="card-btn">edit product</button>
            </a>
        </div>
        <div class="product-info">
            <h2 class="product-brand">${brand}</h2>
            <p class="product-short-des">${desc}</p>
            <p class="product-category">${category}</p>
            <span class="price">${price}</span>
        </div>
    </div>
    `)
  sections.push(cards)
}
const startFunction = () =>{
    fetch('/allproducts')
    .then((res) => res.json())
    .then((res) => processData(res))
    };
    

    
    startFunction()
