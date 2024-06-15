const orders = document.getElementById("user_Orders");


const yes_or_no = (element) =>{
  
  if(element){
    element.forEach((item,i) =>{
      const yes = document.querySelectorAll(".ship_Yes")[i]
        const no = document.querySelectorAll(".ship_No")[i]
        const msg = document.querySelectorAll(".ship_P")[i]
      item.addEventListener('click', () =>{
        item.style.visibility ='hidden';
        yes.style.visibility = "visible"
        no.style.visibility = "visible"
        msg.style.visibility = "visible"
      })
       no.addEventListener('click', () =>{
          console.log("hidden")
          yes.style.visibility = "hidden"
        no.style.visibility = "hidden"
        msg.style.visibility = "hidden"
        item.style.visibility = "visible"
        })
        yes.addEventListener('click', () =>{
          const parent = item.parentNode.parentNode
          const shipOrderObj = { id: parent.childNodes[13].innerHTML,
          tracking_number: document.querySelectorAll(".tracking_Number")[i].value,
        email: parent.childNodes[17].innerHTML}
       fetch('/shipOrder',{
            method: 'put',
            headers:  {'Content-Type': 'application/json'},
            body: JSON.stringify(shipOrderObj)
          }).then((res) => {
            if(res.status == 200){
            window,location.reload()}
            else{alert("Failed to Confirm shipment error")}
          })   
        })
    })
  }
}


const create_Order = (shipping,payment_id,order_price,date,order_status,sections,email) =>{
  let shipping_status
  let shippingBtns
  if(order_status == true){
    shipping_status = "Shipped"
    shippingBtns = `<p>Tracking Number</p><br>
    <span>${shipping.tracking_number}</span>`
  }else{ shipping_status = "Pending shipment"; shippingBtns = new String(`
  <input type="text" class = "tracking_Number" placeholder="tracking number here">
  <div class="shippingBtns">
<button class="shippedBtn" type="button">SHIP ORDER</button>
<p class="ship_P">Are you Sure Is Tracking # correct</p>
        <button class="ship_Yes" type="button">YES</button>
        <button class="ship_No" type="button">NO</button> 
</div>`)} 
  const front = new String(`  <div class="orders">
  <span class="date">${date}</span>
  <span class="order_status">${shipping_status.toString()}</span>`)
  
const back = new String(` <br > <span class="order_price">${order_price}</span>
<p class="order_id">${payment_id}</p>
<p class="shipping">${shipping.address.city +" "+ shipping.address.line1 +" "+ shipping.address.state +" "+ shipping.address.country +" "+ shipping.address.postal_code}</p>
<p class="email">${email}</p>
${shippingBtns}
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
        const size = data[i]['all_Products'][x].size
        if(size.charAt(0) == "N"){
          sizeText = ""
        }else{sizeText = `<span>Size ${size}</span>`  }
      const card = createSection(imgId,imgUrl,description,totalPrice,qty,sizeText)
      sections.push(card)
      
      }
      //console.log(data[i])
     const order = create_Order(data[i].shipping,data[i].payment_id,data[i].order_price,data[i].date,data[i].order_status_shipped,sections,data[i].email)
     ordersList.push(order)
    }
    const html = ordersList.toString()
    const finalhtml = html.replace(/,/g, "")
    orders.innerHTML = finalhtml;
    yes_or_no(document.querySelectorAll(".shippedBtn"))
   
}





const createSection = (imgId, imgUrl, description, totalPrice,qty,size) => {
  
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
    <span>Total Price: ${totalPrice}</span>
  </div>
      <span>Qty: ${qty}</span>
      
     ${size}
     
    `)
    return cards

}

fetch('/sellersOrders').then((res) => {
    if(res.status == 200){
        res.json().then((res) => {
          
          proccessData(res)
        })
    }
    else{
        console.log("failed request")
    }
}) 