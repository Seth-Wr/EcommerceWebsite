const shoppingCart = document.getElementById("shopping-cart");
const sections = [];
const checkoutBtn = document.getElementById("checkout-btn");
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
    shoppingCart.innerHTML = sections.toString();
    

    if(document.querySelectorAll(".deleteBtn")){
      document.querySelectorAll(".deleteBtn").forEach((item,i) =>{
      item.addEventListener('click', () =>{
        const urlLink = data[i].imgId
        const urlParams = "?imgId=" + urlLink
        console.log(urlParams)
        fetch('/deleteCartItem'+urlParams,{
          method: 'delete',
          headers: {'Content-Type': 'application/json'}
        }).then((res) =>{
          if(res.status == 201){
            window.location.reload();
          }
        })

      })        
      })
    }
    if(document.querySelectorAll(".plus-btn")){
      document.querySelectorAll(".plus-btn").forEach((item,i) =>{
        item.addEventListener('click', ()=>{
          const urlLink = data[i].imgId
         const urlParams = "?imgId=" + urlLink
          fetch('/addQtyCart'+urlParams,{
            method: 'put',
            headers: {'Content-Type': 'application/json'}
          }).then((res) =>{
            if(res.status == 201){
              let newPrice = parseInt(document.querySelectorAll('.price')[i].childNodes[1].textContent) + data[i].unitPrice
              let newTotalPrice = parseInt(document.querySelector('.total-price').textContent) + data[i].unitPrice
              document.querySelectorAll('.price')[i].childNodes[1].textContent = newPrice
              document.querySelectorAll(".qtyInput")[i].value ++;
              document.querySelector(".badge").textContent ++;
              document.querySelector('.total-price').textContent = newTotalPrice
         } 
        })
        })
      })

    }

    if(document.querySelectorAll(".minus-btn")){
      document.querySelectorAll(".minus-btn").forEach((item,i) =>{
        item.addEventListener('click', ()=>{
          const urlLink = data[i].imgId
         const urlParams = "?imgId=" + urlLink
          fetch('/deleteQtyCart'+urlParams,{
            method: 'put',
            headers: {'Content-Type': 'application/json'}
          }).then((res) =>{
            if(res.status == 201){
              let newPrice = parseInt(document.querySelectorAll('.price')[i].childNodes[1].textContent) - data[i].unitPrice
              let newTotalPrice = parseInt(document.querySelector('.total-price').textContent) - data[i].unitPrice
              document.querySelectorAll('.price')[i].childNodes[1].textContent = newPrice
              document.querySelectorAll(".qtyInput")[i].value --;
              document.querySelector(".badge").textContent --;
              document.querySelector('.total-price').textContent = newTotalPrice
              if(document.querySelectorAll(".qtyInput")[i].value == 0){
                fetch('/deleteCartItem'+urlParams,{
                  method: 'delete',
                  headers: {'Content-Type': 'application/json'}
                }).then((res) =>{
                  if(res.status == 201){
                    window.location.reload();
                  }
                })
              } 
            }
          })
        })
      })

    }

    if(document.querySelectorAll(".qtyInput")){
      document.querySelectorAll(".qtyInput").forEach((item,i) =>{
        item.addEventListener('keydown', (e) =>{
          // regular expression to only allow numbers and backspaces
          if(!(/[0-9]|Backspace|ArrowLeft|ArrowRight|Enter|Delete/.test(e.key))){
            e.preventDefault()
            
          }
          console.log(e.key)
        })
        item.addEventListener('change', () =>{
          console.log("item value" + item.value)
          const urlLink = data[i].imgId
         const urlParams = "?imgId=" + urlLink
          fetch('/inputChangeCart'+urlParams+"&inputQty="+item.value,{
            method: 'put',
            headers: {'Content-Type': 'application/json'}
          }).then((res) =>{
            if(res.status == 201){
              res.json().then((res) =>{
                document.querySelectorAll('.price')[i].childNodes[1].textContent = res.itemPrice
                document.querySelector(".badge").textContent = res.totalQty;
                document.querySelector('.total-price').textContent = res.totalPrice        
              })
            }
          })
          })
      })
    }

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
const getThumb = (element) =>{
      const urlObj = {}
      element.forEach((item,i) =>{
        const imgLink = item.parentNode.href
        const imgLinkSplit = imgLink.split("=")
        const imgUrl = element[i].src
        urlObj [imgLinkSplit[1]] = imgUrl;
        
      })
      return urlObj
}


checkoutBtn.addEventListener('click',() =>{
  fetch('/create-checkout-session',{
    method:'post',
    mode: 'cors',
    headers:  {'Content-Type': 'application/json'},
    credentials: 'include',
    body: JSON.stringify( getThumb(document.querySelectorAll('.product-thumb'))),
  }).then((res) => res.json())
  .then((res) => window.location.href =  res.url)
  })

fetch('/shoppingCart').then((res) => {
    if(res.status == 200){
        res.json().then((res) => {
            proccessData(res)
        })
    }
    else{
        console.log("failed request")
    }
}) 