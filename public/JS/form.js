
const loader = document.querySelector('.loader');
const submitBtn = document.querySelector('.submit-btn');
const name1 = document.querySelector('#name');
const email = document.querySelector('#email');
const password = document.querySelector('#password');
const number = document.querySelector('#number');
const tac = document.querySelector("#terms-and-cond");
const notification = document.querySelector('#notification');


window.onload = submitBtn.addEventListener('click', () =>{
    const seller = document.querySelector('#seller');
    let sellerBox = false
    if(seller.checked){
        sellerBox = true
           
    }
   
      if(name1.value.length < 3){
        showAlert('name must be 3 letters long');
    }else if(!email.value.length){
        showAlert('enter your email');
    }
    else if(password.value.length < 8){
        showAlert('password should be 8 letters long');
    } else if(!number.value.length){
        showAlert('enter your phone number');
    } else if(!Number(number.value) || number.value.length < 10){
        showAlert('invalid number, please enter valid one');
    } else if(!tac.checked){
        showAlert('you must agree to our terms and conditions');
    } else{ 
        sendData('/signup',{
            name1: name1.value,
            email: email.value,
            password: password.value,
            number: number.value,
            tac: tac.checked,
            notification: notification.checked,
            seller: sellerBox.valueOf()
        })    
    }      
})

const showAlert = (msg) => {
    let alertBox = document.querySelector('.alert-box');
    let alertMsg = document.querySelector('.alert-msg');
    alertMsg.innerHTML = msg;
    alertBox.classList.add('show');
    setTimeout(() =>{
        alertBox.classList.remove('show');
    }, 3000);
}

const sendData = (path, data) => {
    fetch(path, {
        method: 'post',
        headers: new Headers({'Content-Type': 'application/json'}),
        body: JSON.stringify(data)
    }).then((res) =>{
        if(res.status == 201){
            window.location.href = ('/login')
        }
    }).catch(err => alert("Unexpected Error"));
}
