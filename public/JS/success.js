

function showAlert(msg){
    let alertBox = document.querySelector('.alert-box');
    let alertMsg = document.querySelector('.alert-msg');
    alertMsg.innerHTML = msg;
    alertBox.classList.add('show');
    setTimeout(() =>{
        alertBox.classList.remove('show');
    }, 1000);
}

function deleteCart(){
fetch('/deleteCart',{
    method: 'put',
    headers: {'Content-Type': 'application/json'}
}).then((res) =>{
    if(res.status == 200){
    document.querySelector(".badge").textContent = " "
    }
})
}

const deleteCart_timeout = setTimeout(deleteCart,1000)
const redirect_timeout = setTimeout(redirect,10000)
function redirect(){
    window.location.href = 'http://localhost:3000/index.html';
}