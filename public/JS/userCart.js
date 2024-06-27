const shoppingCart = document.getElementById("shopping-cart");
const sections = [];
const checkoutBtn = document.getElementById("checkout-btn");
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
        }else{sizeText = `<span class"size">Size ${size}</span>`  }
        createSection(imgId,imgUrl,description,price,qty,unitPrice,sizeText,sale_price_Text)
    }
    const html = sections.toString()
    const finalhtml = html.replace(/,/g, "")
    shoppingCart.innerHTML = finalhtml;
    document.querySelector(".totalItems").textContent =  document.querySelector(".badge").textContent
   

    if(document.querySelectorAll(".deleteBtn")){
      document.querySelectorAll(".deleteBtn").forEach((item,i) =>{
      item.addEventListener('click', () =>{
        loader.style.display ="flex";
        const urlLink = data[i].imgId
        const size = data[i].size
        const urlParams = "?imgId=" + urlLink +"&size="+size
        fetch('/deleteCartItem'+urlParams,{
          method: 'delete',
          headers: {'Content-Type': 'application/json'}
        }).then((res) =>{
          if(res.status == 201){
            window.location.reload();
          }
          else {loader.style.display ="none"; showAlert("Error")}
        }).catch(err => {loader.style.display ="none"; showAlert("Error")});

      })       
      })
    }
    if(document.querySelectorAll(".plus-btn")){
      document.querySelectorAll(".plus-btn").forEach((item,i) =>{
        item.addEventListener('click', ()=>{
          loader.style.display ="flex";
          const urlLink = data[i].imgId
          const size = data[i].size
          const urlParams = "?imgId=" + urlLink +"&size="+size
          fetch('/addQtyCart'+urlParams,{
            method: 'put',
            headers: {'Content-Type': 'application/json'}
          }).then((res) =>{
            if(res.status == 201){
              let newPrice = parseInt(document.querySelectorAll('.price')[i].childNodes[3].textContent) + data[i].unitPrice
              let newTotalPrice = parseInt(document.querySelector('.total-price').textContent) + data[i].unitPrice
              document.querySelectorAll('.price')[i].childNodes[3].textContent = newPrice
              document.querySelectorAll(".qtyInput")[i].value ++;
              document.querySelector(".badge").textContent ++;
              document.querySelector(".totalItems").textContent ++;
              document.querySelector('.total-price').textContent = newTotalPrice
              loader.style.display ="none";
         }else { loader.style.display ="none"; showAlert("Error")} 
        }).catch(err => { loader.style.display ="none"; showAlert("Error")});
        })
      })

    }

    if(document.querySelectorAll(".minus-btn")){
      document.querySelectorAll(".minus-btn").forEach((item,i) =>{
        item.addEventListener('click', ()=>{
          loader.style.display ="flex";
          const urlLink = data[i].imgId
          const size = data[i].size
          const urlParams = "?imgId=" + urlLink +"&size="+size
          fetch('/deleteQtyCart'+urlParams,{
            method: 'put',
            headers: {'Content-Type': 'application/json'}
          }).then((res) =>{
            if(res.status == 201){
              let newPrice = parseInt(document.querySelectorAll('.price')[i].childNodes[3].textContent) - data[i].unitPrice
              let newTotalPrice = parseInt(document.querySelector('.total-price').textContent) - data[i].unitPrice
              document.querySelectorAll('.price')[i].childNodes[3].textContent = newPrice
              document.querySelectorAll(".qtyInput")[i].value --;
              document.querySelector(".badge").textContent --;
              document.querySelector(".totalItems").textContent --;
              document.querySelector('.total-price').textContent = newTotalPrice
              loader.style.display ="none";
              if(document.querySelectorAll(".qtyInput")[i].value == 0){
                fetch('/deleteCartItem'+urlParams,{
                  method: 'delete',
                  headers: {'Content-Type': 'application/json'}
                }).then((res) =>{
                  if(res.status == 201){
                    window.location.reload();
                  }else { loader.style.display ="none"; showAlert("Error")}
                })
              } 
            }else { loader.style.display ="none"; showAlert("Error")}
          }).catch(err => { loader.style.display ="none"; showAlert("Error")});
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
          
        })
        item.addEventListener('change', () =>{
          loader.style.display = "flex";
          const urlLink = data[i].imgId
          const size = data[i].size
          const urlParams = "?imgId=" + urlLink +"&size="+size
          if(document.querySelectorAll(".qtyInput")[i].value == 0){
            fetch('/deleteCartItem'+urlParams,{
              method: 'delete',
              headers: {'Content-Type': 'application/json'}
            }).then((res) =>{
              if(res.status == 201){
                
               return window.location.reload();
              }
              else{
                loader.style.display ="none"; showAlert("Error")
              }
            }).catch(err => { loader.style.display ="none"; showAlert("Error")});
          }
          else{
            fetch('/inputChangeCart'+urlParams+"&inputQty="+item.value,{
              method: 'put',
              headers: {'Content-Type': 'application/json'}
            }).then((res) =>{
              if(res.status == 201){
                res.json().then((res) =>{
                  document.querySelectorAll('.price')[i].childNodes[3].textContent = res.itemPrice
                  document.querySelector(".badge").textContent = res.totalQty;
                  document.querySelector(".totalItems").textContent = res.totalQty;
                  document.querySelector('.total-price').textContent = res.totalPrice      
                  loader.style.display ="none";  
                })
              } else{
                loader.style.display ="none"; showAlert("Error")
              }
            }).catch(err => {  loader.style.display ="none"; showAlert("Error")});
          } 
        
          })
      })
    }
    loader.style.display = 'none';
}


const createSection = (imgId, imgUrl, description, price, qty,unitPrice,size,sale_price) => {
  const cards = new String(`
  <div class="item">
      
  <div class="image">
  <a href="product.html?imgId=${imgId}">
  <img src="${imgUrl}" class="product-thumb" alt="">
  </a>
  </div>
  <div class="items-text">
  <div class="description">
    <span class="item-text-inner">${description}</span>
    
  </div>
  ${size}
  <div class="price_per">
    <span class="item-text-inner">${unitPrice}</span>
    ${sale_price} 
  </div>
  <div class="price">
  <span>Total: </span>
  <span class="item-text-inner">${price}</span>
</div>
</div>
 
  <div class="qtyBox">
  <div class="quantity">
    <button class="plus-btn qtyBtn" type="button" name="button">
      <img src="/img/plus.jpg" class="btn-img" alt="" />
    </button>
    <input type="number" value=${qty} class = "qtyInput" >
    <button class="minus-btn qtyBtn" type="button" name="button">
      <img src="/img/minus.jpg" class="btn-img" alt="" />
    </button>
  </div>
 
    <button class="deleteBtn">Delete</button>
    </div>
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
  loader.style.display = "flex";
  fetch('/create-checkout-session',{
    method:'post',
    mode: 'cors',
    headers:  {'Content-Type': 'application/json'},
    credentials: 'include',
    body: JSON.stringify( getThumb(document.querySelectorAll('.product-thumb'))),
  }).then((res) => res.json())
  .then((res) =>{loader.style.display ="none"; window.location.href = res.url})
  .catch(err =>{ loader.style.display ="none"; showAlert("Error")}); })

fetch('/shoppingCart').then((res) => {
    if(res.status == 200){
        res.json().then((res) => {
            proccessData(res)
        })
    }
    else{
      loader.style.display = "none";
        showAlert("failed request")
    }
}).catch(err => { loader.style.display = "none"; showAlert("Error")}); 

