const submitBtn = document.querySelector('.submit-btn');
const email = document.querySelector('#email');

function showAlert(msg){
    let alertBox = document.querySelector('.alert-box');
    let alertMsg = document.querySelector('.alert-msg');
    alertMsg.innerHTML = msg;
    alertBox.classList.add('show');
    setTimeout(() =>{
        alertBox.classList.remove('show');
    }, 1000);
}
const password = document.querySelector('#password');
submitBtn.addEventListener('click', () =>{

      sendData('/user_login',{
          username: email.value,
          password: password.value,
      })    
        
})
const sendData = (path, data) => {
    fetch(path, {
        method: 'post',
        headers: new Headers({'Content-Type': 'application/json'}),
        body: JSON.stringify(data)
    }).then((res) =>{
        if(res.url == "http://localhost:3000/login"){
            showAlert('Invalid Username or Password')
              
        }
      else{window.location.href = (res.url) }
    }).catch(err => showAlert('Login error'));
}