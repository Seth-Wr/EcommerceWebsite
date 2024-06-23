const section = document.querySelector('.product-container');
const sections = [];
const myKeysValues = window.location.search;

const processData = async(data) =>{
    for(let i=0; i < data.length; i++){
            const url = data[i].imgUrl;
            const desc = data[i].description;
            const brand = data[i].brand;
            const price = data[i].price;
            const imgId = data[i].imgId
            createSection(url,desc,brand,price,imgId);
    }
    const html = sections.toString()
    const finalhtml = html.replace(/,/g, "")
    section.innerHTML = finalhtml;
}



const createSection = (url,desc,brand,price,imgId) =>{
    const cards = new String(`
    <div class="product-card">
        <div class="product-image"><a href="product.html?imgId=${imgId}">
            <img src="${url}" class="product-thumb" alt="">
            </a>
           
        </div>
        <div class="product-info">
            
            <h2 class="product-brand">${brand}</h2>
            <p class="product-short-des">${desc}</p>
            <span class="price">${price}</span>
            
        </div>
    </div>
    `)
  sections.push(cards)
}
const startFunction = () =>{
    fetch('/products'+myKeysValues)
    .then((res) => res.json())
    .then((res) => processData(res))
    .catch(err => alert("Unexpected Error"));
    };
    

    
    startFunction()
