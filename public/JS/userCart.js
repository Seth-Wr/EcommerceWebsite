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
        const size = data[i].size
        const sale_price = data[i].sale_price
      let sizeText
      let sale_price_Text
      if(sale_price == null || sale_price <= 0){
        sale_price_Text = ""
      }else {
        sale_price_Text = ` <span>Sale: ${sale_price}</span>  `
      }

        if(size.charAt(0) == "N"){
          sizeText = ""
        }else{sizeText = `<span>Size ${size}</span>`  }
        createSection(imgId,imgUrl,description,price,qty,unitPrice,sizeText,sale_price_Text)
    }
    shoppingCart.innerHTML = sections.toString();
    

    if(document.querySelectorAll(".deleteBtn")){
      document.querySelectorAll(".deleteBtn").forEach((item,i) =>{
      item.addEventListener('click', () =>{
        const urlLink = data[i].imgId
        const size = data[i].size
        const urlParams = "?imgId=" + urlLink +"&size="+size
        console.log(urlParams)
        fetch('/deleteCartItem'+urlParams,{
          method: 'delete',
          headers: {'Content-Type': 'application/json'}
        }).then((res) =>{
          if(res.status == 201){
            window.location.reload();
          }
        }).catch(err => alert("Unexpected Error"));

      })        
      })
    }
    if(document.querySelectorAll(".plus-btn")){
      document.querySelectorAll(".plus-btn").forEach((item,i) =>{
        item.addEventListener('click', ()=>{
          const urlLink = data[i].imgId
          const size = data[i].size
          const urlParams = "?imgId=" + urlLink +"&size="+size
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
        }).catch(err => alert("Unexpected Error"));
        })
      })

    }

    if(document.querySelectorAll(".minus-btn")){
      document.querySelectorAll(".minus-btn").forEach((item,i) =>{
        item.addEventListener('click', ()=>{
          const urlLink = data[i].imgId
          const size = data[i].size
          const urlParams = "?imgId=" + urlLink +"&size="+size
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
          }).catch(err => alert("Unexpected Error"));
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
          const size = data[i].size
          const urlParams = "?imgId=" + urlLink +"&size="+size
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
          }).catch(err => alert("Unexpected Error"));
          })
      })
    }

}


const createSection = (imgId, imgUrl, description, price, qty,unitPrice,size,sale_price) => {
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
    ${sale_price} 
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
  ${size}
    <button class="deleteBtn">Delete</button>
    </div>`)
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
  .then((res) => window.location.href = res.url)
  .catch(err => alert("Unexpected Error")); })

fetch('/shoppingCart').then((res) => {
    if(res.status == 200){
        res.json().then((res) => {
            proccessData(res)
        })
    }
    else{
        console.log("failed request")
    }
}).catch(err => alert("Unexpected Error")); 