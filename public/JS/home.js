function showAlert(msg){
    let alertBox = document.querySelector('.alert-box');
    let alertMsg = document.querySelector('.alert-msg');
    alertMsg.innerHTML = msg;
    alertBox.classList.add('show');
    setTimeout(() =>{
        alertBox.classList.remove('show');
    }, 1000);
}

const addToCart = document.querySelectorAll(".card-btn")

addToCart.forEach((item,i) => {
    item.addEventListener('click', () => {
        fetch('/addToCart').then((res) => console.log(res))
        .catch(err => showAlert("Unexpected Error"));
    })
})

