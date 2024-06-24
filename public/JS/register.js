
const submitBtn = document.querySelector('.submit-btn');
const email = document.querySelector('#email');
const password = document.querySelector('#password');
const confirm_password = document.querySelector('#confirm-password');
const emailPattern = /^([a-z\d\.-]+)@([a-z\d-]+)\.([a-z]{2,8})(\.[a-z]{2,8})?$/


function showAlert(msg){
    let alertBox = document.querySelector('.alert-box');
    let alertMsg = document.querySelector('.alert-msg');
    alertMsg.innerHTML = msg;
    alertBox.classList.add('show');
    setTimeout(() =>{
        alertBox.classList.remove('show');
    }, 1000);
}


window.onload = submitBtn.addEventListener('click', () =>{
   
     if(!email.value.length){
        showAlert('enter your email');
    }
    else if(!emailPattern.test(email.value)){
        showAlert("Need valid Email")
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


const sendData = (path, data) => {
    fetch(path, {
        method: 'post',
        headers: new Headers({'Content-Type': 'application/json'}),
        body: JSON.stringify(data)
    }).then((res) =>{
        if(res.status == 201){
            window.location.href = ('/login')
        }
        else if(res.status == 400){
            showAlert("Email exists already")
        }
    }).catch(err => showAlert("Unexpected Error"));
}
