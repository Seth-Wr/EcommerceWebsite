const reloadPage = () => {
	window.onpageshow = function(event) {
		if (event.persisted) {
			window.location.reload();
		}
	};
};

reloadPage() ; 

const createNav = () => {
let nav = document.querySelector('.navbar');

nav.innerHTML = `
<a href="index.html" class="logo">
        <img src="img/logo.jpg" alt="">
    </a>
        <div class="nav-items">
            <div class="search">
                <input type="text" class="search-box" placeholder="search brand, product">
                <button class="search-btn">search</button>
            </div>
            <ul class="links-container">
                <li><a href="/search?Category=swim_suits">Swim Suits</a></li>
                <li><a href="search.html?Category=full_sets">Sets</a></li>
                <li><a href="search.html?Category=tops">Tops</a></li>
                <li><a href="search.html?Category=bottoms">Bottoms</a></li>
                <li><a href="search.html"><i class="fa fa-shopping-cart" aria-hidden="true"></i></a></li>
            </ul>
        </div>
        <div id="logout"></div>
        <div id="login"></div>
        <div id="myOrders"></div>

        <a href="/userCart">
        <i class="shoppingCart"></i> Shopping Cart <span class="badge"></span>
     </a>
`;
}
console.log("created")

createNav();


const getUserSession = async() =>{ 
fetch('/getUserSession').then((res) =>  {
    if(res.status == 202){
        document.getElementById('logout').innerHTML =`<button id="logoutBtn">logout</button>`
        document.getElementById('logoutBtn').addEventListener('click', ()=>{
            fetch('/logout').then((res)=>{
                window.location.href = res.url
            })
        })
        document.getElementById('myOrders').innerHTML =`<button id="ordersBtn">My Orders</button>`
        document.getElementById('ordersBtn').addEventListener('click', ()=>{
            fetch('/userOrders').then((res)=>{
                window.location.href = res.url
            })
        })

   }else{
            document.getElementById('login').innerHTML =`<button id="loginBtn">log in</button>`
            document.getElementById('loginBtn').addEventListener('click', ()=>{
                fetch('/login').then((res)=>{
                    window.location.href = res.url
                })
            })
    }  
    
    res.json().then((res) =>{
        if(res.totalQty){
            document.querySelector(".badge").textContent = res.totalQty;
            
        }
        if(document.querySelector(".total-price") && res.totalPrice){
            document.querySelector(".total-price").textContent = res.totalPrice;
        }
        
    })
})
}



   getUserSession()
  

