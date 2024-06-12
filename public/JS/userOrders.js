const orders = document.getElementById("user_Orders");
const sections = []

const proccessData = (data) =>{
    for(let i =0;i < data.length; i++){
        const imgId = data[i].imgId
        const imgUrl = data[i].imgUrl
        const description = data[i].description
        const price = data[i].price
        const qty = data[i].qty
        const unitPrice =data[i].unitPrice
        createSection(imgId,imgUrl,description,price,qty,unitPrice)
    }
    orders.innerHTML = sections.toString();
    
}





const createSection = (imgId, imgUrl, description, price, qty,unitPrice) => {
    const cards = new String(`
    <div class="item">
        
    <div class="image">
    <a href="product.html?imgId=${imgId}">
    <img src="${imgUrl}" class="product-thumb" alt="">
    </a>
    </div>
 
    <div class="description">
      <span>${description}</span>
      
    </div>
     
    <div class="price_per">
      <span>${unitPrice}</span>
      
    </div>
    <div class="price">
    <span>${price}</span>
  </div>
    <div class="quantity">
      <button class="plus-btn" type="button" name="button">
        <img src="/img/plus.jpg" alt="" />
      </button>
      <input type="number" value=${qty} class = "qtyInput" >
      <button class="minus-btn" type="button" name="button">
        <img src="/img/minus.jpg" alt="" />
      </button>
    </div>
      <button class="deleteBtn">Delete</button>
    `)
    sections.push(cards)

}

fetch('/customerOrders').then((res) => {
    if(res.status == 200){
        res.json().then((res) => {
          console.log(res)
            //proccessData(res)
        })
    }
    else{
        console.log("failed request")
    }
}) 