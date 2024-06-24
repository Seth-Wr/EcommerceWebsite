const orders = document.getElementById("user_Orders");
function showAlert(msg){
  let alertBox = document.querySelector('.alert-box');
  let alertMsg = document.querySelector('.alert-msg');
  alertMsg.innerHTML = msg;
  alertBox.classList.add('show');
  setTimeout(() =>{
      alertBox.classList.remove('show');
  }, 1000);
}





const create_Order = (shipping,payment_id,order_price,date,order_status,sections,totalQty) =>{
  let shipping_status
  if(order_status == true){
    shipping_status = "Shipped" 
  }else{ shipping_status = "Pending shipment"} 

const front = new String(`<div class="order">
 <div class="order-info">
<span class="date order-text">Date: ${date}</span><br>
<p class="order_id order-text">Order ID: ${payment_id}</p><br>
<span class="order-text">Total Quantity: ${totalQty}</span>
<br > <span class="order_price order-text">Order Total: ${order_price}</span><br>
<span class="order_status order-text">${shipping_status.toString()}</span>
<p class="shipping order-text">Shipping: ${shipping.address.city +" "+ shipping.address.line1 +" "+ shipping.address.state +" "+ shipping.address.country +" "+ shipping.address.postal_code}</p>
</div>  <div class="order-items"> `)
  const back = new String(`</div>  </div>
     `)  


const order = front + sections.toString() + back
return order

}

const proccessData = (data) =>{
  const ordersList = []
    for(let i =0;i < data.length; i++){
      const sections = []
      let totalQty = 0
      for(let x =0; x < data[i]['all_Products'].length; x++){
        
        const imgId = data[i]['all_Products'][x].imgId
        const imgUrl = data[i]['all_Products'][x].imgUrl
        const description = data[i]['all_Products'][x].description
        const totalPrice = data[i]['all_Products'][x].totalPrice
        const qty = data[i]['all_Products'][x].qty
        const size = data[i]['all_Products'][x].size
        let sizeText
        if(size.charAt(0) == "N"){
          sizeText = ""
        }else{sizeText = `<span>Size ${size}</span>`  }
        totalQty += parseInt(qty)
      const card = createSection(imgId,imgUrl,description,totalPrice,qty,sizeText)
      sections.push(card)
      
      }

     const order = create_Order(data[i].shipping,data[i].payment_id,data[i].order_price,data[i].date,data[i].order_status_shipped,sections,totalQty)
     ordersList.push(order)
    }
    const html = ordersList.toString()
    const finalhtml = html.replace(/,/g, "")
    orders.innerHTML = finalhtml;
    
}





const createSection = (imgId, imgUrl, description, totalPrice,qty,size) => {
  
    const cards = new String(`
    <div class="item">
        
    <div class="image">
    <a href="product.html?imgId=${imgId}">
    <img src="${imgUrl}" class="product-thumb" alt="">
    </a>
    </div>
    <div class="items-text">
    <div class="description">
      <span>${description}</span>
      
    </div>
    ${size}
     
    <div class="price">
    <span>Total: ${totalPrice}</span>
  </div>
      <span class="qty">Qty: ${qty}</span>
      </div>
      
      </div>
     
     
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
}).catch(err => showAlert("Failed to load")); 