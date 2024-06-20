

const submitBtn = document.querySelector('.submit-btn');
const email = document.querySelector('#email');
const password = document.querySelector('#password');
const confirm_password = document.querySelector('#confirm-password');


window.onload = submitBtn.addEventListener('click', () =>{
   
     if(!email.value.length){
        showAlert('enter your email');
    }
    else if(password.value.length < 8){
        showAlert('password should be 8 letters long');
    }
    else if (password.value != confirm_password.value){
        showAlert('Passwords must match')
    }
     else{ 
        sendData('/signup',{
            email: email.value,
            password: password.value,
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
