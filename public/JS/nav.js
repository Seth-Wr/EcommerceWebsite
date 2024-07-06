
let nav = document.querySelector('.navbar');
const createNav = () => {


nav.innerHTML = `
    
        <div class="nav-items">
        <a class="mobile-home" href="/index.html">Propa Tings</a>
            <div class="shoppingcart_img_box">
            <a href="/userCart" class="shoppingcart_a">
                <img src="../img/shoppingcart.jpg" alt"">
                </a>
                <span class="mobile_qty"></span>
                </div>
        <div class="ham-menu">
        <span></span>
        <span></span>
        <span></span>
        </div>
            <ul class="links-container">
                <li><a href="/index.html">Home</a></li>
                <li>   <a href="/userCart">
                <i class="shoppingCart"></i> Shopping Cart <span class="badge"></span>
             </a>
               </li>
                <li id="myOrders"></li>
                
                <li><a href="/search?Category=swim_suits">Swim Suits</a></li>
                <li><a href="search.html?Category=full_sets">Sets</a></li>
                <li><a href="search.html?Category=tops">Tops</a></li>
                <li><a href="search.html?Category=bottoms">Bottoms</a></li>
                <li id="logout"></li>
                <li id="login"></li>
                
            </ul>
            
           
           
        </div> 
        
     
        
        
        

    
     
`;
}
console.log("created")

createNav();

const ham_menu = document.querySelector(".ham-menu")
const navlinks = document.querySelector(".links-container")
const ham_menu_Active = ham_menu.classList
ham_menu.addEventListener('click', () =>{

        ham_menu.classList.toggle("active");
        navlinks.classList.toggle("active");
        nav.classList.toggle("active");
    
    
})

const getUserSession = async() =>{ 
fetch('/getUserSession').then((res) =>  {
    
    if(res.status == 204){
        window.location.replace("/seller")
        return
    }
    if(res.status == 202){
        document.getElementById('logout').innerHTML =`<button id="logoutBtn">logout</button>`
        document.getElementById('logoutBtn').addEventListener('click', ()=>{
            fetch('/logout').then((res)=>{
                window.location.href = res.url
            }).catch(err => showAlert("Unexpected Error"));
        })
        document.getElementById('myOrders').innerHTML =`<button id="ordersBtn">My Orders</button>`
        document.getElementById('ordersBtn').addEventListener('click', ()=>{
            fetch('/userOrders').then((res)=>{
                window.location.href = res.url
            }).catch(err => showAlert("Unexpected Error"));
        })

   }else{
            document.getElementById('login').innerHTML =`<button id="loginBtn">log in</button>`
            document.getElementById('loginBtn').addEventListener('click', ()=>{
                fetch('/login').then((res)=>{
                    window.location.href = res.url
                }).catch(err => showAlert("Unexpected Error"));
            })
    }  
    
    res.json().then((res) =>{
        if(res.totalQty){
            //adding qty to navbar
            document.querySelector(".badge").textContent = res.totalQty;
            document.querySelector(".mobile_qty").textContent = res.totalQty;
            
        }
        if(document.querySelector(".total-price") && res.totalPrice){
            document.querySelector(".total-price").textContent = res.totalPrice;
        }
        
    }).catch(err => showAlert("Unexpected Error"));
})
}




   getUserSession()
  

   const reloadPage = () => {
	window.onpageshow = function(event) {
		if (event.persisted) {
            // updating nav bar data for shopping cart
			fetch('/getShoppingCartQty').then((res) =>{
                if(res.status == 200){
                    res.json().then((res) => {
                        document.querySelector(".badge").textContent = res.qty
                        document.querySelector(".mobile_qty").textContent = res.totalQty;
                    })
                }else{
                    return
                }
            })

		}
	};
};

reloadPage() ; 