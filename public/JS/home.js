
const addToCart = document.querySelectorAll(".card-btn")

addToCart.forEach((item,i) => {
    item.addEventListener('click', () => {
        fetch('/addToCart').then((res) => console.log(res))
    })
})

