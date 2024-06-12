const orders = document.getElementById("user_Orders");





const create_Order = (shipping,payment_id,order_price,date,order_status,sections) =>{
  let shipping_status
  if(order_status == true){
    shipping_status = "Shipped"
  }else{ shipping_status = "Pending shipment"} 
  const front = new String(`  <div class="orders">
  <span class="date">${date}</span>
  <span class="order_status">${shipping_status.toString()}</span>`)
  
const back = new String(` <br > <span class="order_price">${order_price}</span>
<p class="order_id">${payment_id}</p>
<p class="shipping">${shipping.address.city +" "+ shipping.address.line1 +" "+ shipping.address.state +" "+ shipping.address.country +" "+ shipping.address.postal_code}</p>
</div><br>     `)

const order = front + sections.toString() + back
return order

}

const proccessData = (data) =>{
  const ordersList = []
    for(let i =0;i < data.length; i++){
      const sections = []
      for(let x =0; x < data[i]['all_Products'].length; x++){
        
        const imgId = data[i]['all_Products'][x].imgId
        const imgUrl = data[i]['all_Products'][x].imgUrl
        const description = data[i]['all_Products'][x].description
        const totalPrice = data[i]['all_Products'][x].totalPrice
        const qty = data[i]['all_Products'][x].qty

      const card = createSection(imgId,imgUrl,description,totalPrice,qty)
      sections.push(card)
      
      }
     const order = create_Order(data[i].shipping,data[i].payment_id,data[i].order_price,data[i].date,data[i].order_status_shipped,sections)
     ordersList.push(order)
    }
    const html = ordersList.toString()
    const finalhtml = html.replace(/,/g, "")
    orders.innerHTML = finalhtml;
    
}





const createSection = (imgId, imgUrl, description, totalPrice,qty) => {
  
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
     
    
    <div class="price">
    <span>${totalPrice}</span>
  </div>
      <span>${qty}</span>
      
    
     
    `)
    return cards

}

fetch('/customerOrders').then((res) => {
    if(res.status == 200){
        res.json().then((res) => {
          
          proccessData(res)
        })
    }
    else{
        console.log("failed request")
    }
}) 