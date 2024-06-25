const reloadPage = () => {
	window.onpageshow = function(event) {
		if (event.persisted) {
			window.location.reload();
		}
	};
};  

reloadPage() ; 

let nav = document.querySelector('.navbar');

const createNav = () => {


nav.innerHTML = `
<div class="nav-items">
<a class="mobile-home" href="/index.html">Propa Tingz</a>
            
<div class="ham-menu">
<span></span>
<span></span>
<span></span>
</div>
<ul class="links-container">
                <li><a href="/seller.html">Home</a></li>
               
                
                <li><a href="/addProduct.html">Add a product</a></li>
                <li> <a href="/sellerOrders.html">My Orders</a></li>
               
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
        document.getElementById('logout').innerHTML =`<button id="logoutBtn">logout</button>`
        document.getElementById('logoutBtn').addEventListener('click', ()=>{
            fetch('/logout').then((res)=>{
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
    
})
}



   getUserSession()
  

