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
        <div class="nav-items">
            
               <a href="/addProduct.html">Add a product</a>
               <a href="/sellerOrders.html">My Orders</a>
                
        </div>
        <div id="logout"></div>
        <div id="login"></div>

`;
}
console.log("created")

createNav();


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
  

