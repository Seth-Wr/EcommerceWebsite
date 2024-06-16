const submitBtn = document.querySelector('.submit-btn');
const email = document.querySelector('#email');
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
       window.location.href = (res.url)
    }).catch(err => alert("Unexpected Error"));
}