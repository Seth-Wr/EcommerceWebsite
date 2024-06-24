const fileInput = document.getElementById('picture');
const fileInput2 = document.getElementById('picture2');
const fileInput3 = document.getElementById('picture3');
const fileInput4 = document.getElementById('picture4');
const formInput = document.getElementById('form');
const WIDTH = 400;
const img1 = document.getElementById('img1')
const img2 = document.getElementById('img2')
const img3 = document.getElementById('img3')
const img4 = document.getElementById('img4')
let new_Blob;
let new_Blob2;
let new_Blob3;
let new_Blob4;
const productImages = document.querySelectorAll(".product-images img")
const productImageSlide = document.querySelector(".image-slider");
let activeImageSlide = 0;
function showAlert(msg){
    let alertBox = document.querySelector('.alert-box');
    let alertMsg = document.querySelector('.alert-msg');
    alertMsg.innerHTML = msg;
    alertBox.classList.add('show');
    setTimeout(() =>{
        alertBox.classList.remove('show');
    }, 1000);
}


//show resized photos before uploading
const previewPhoto = () => {
    const file = fileInput.files;
    if (file) {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(file[0]);        
          fileReader.onload = event => {
            const previewImg = document.createElement("img"); 
            const imgUrl = event.target.result;
            previewImg.src = imgUrl;
                previewImg.onload = (e) => {
                   
                    const canvas = document.createElement("canvas")
                    const ratio = WIDTH /e.target.width;
                    canvas.width = WIDTH;
                    canvas.height = 500 //e.target.height * ratio;
                    const context = canvas.getContext("2d");
                    context.drawImage(previewImg, 0,0, canvas.width, canvas.height);
                    context.canvas.toBlob((blob) => {
                        new_Blob = blob;
                        const url = URL.createObjectURL(blob);
                        img1.src = url;
                        productImageSlide.style.backgroundImage = `url('${img1.src}')`;
                        productImages[activeImageSlide].classList.remove('active');
                            img1.classList.add('active');
                            activeImageSlide = 0
                        img1.addEventListener("click", ()=>{
                            productImages[activeImageSlide].classList.remove('active');
                            img1.classList.add('active');
                            productImageSlide.style.backgroundImage = `url('${img1.src}')`;
                            activeImageSlide = 0;
                        })
                        
                    },"image/jpeg", 90);
                }  }  }  }

const previewPhoto2 = () => {
    const file = fileInput2.files;
    if (file) {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(file[0]);        
          fileReader.onload = event => {
            const previewImg = document.createElement("img"); 
            const imgUrl = event.target.result;
            previewImg.src = imgUrl;
                previewImg.onload = (e) => {
                   
                    const canvas = document.createElement("canvas")
                    const ratio = WIDTH /e.target.width;
                    canvas.width = WIDTH;
                    canvas.height = 500 //e.target.height * ratio;
                    const context = canvas.getContext("2d");
                    context.drawImage(previewImg, 0,0, canvas.width, canvas.height);
                    context.canvas.toBlob((blob) => {
                        new_Blob2 = blob;
                        const new_Img = document.createElement("img");
                        new_Img.setAttribute("id", "newImg");
                        const url = URL.createObjectURL(blob);
                        img2.src = url;
                        productImageSlide.style.backgroundImage = `url('${img2.src}')`;
                        productImages[activeImageSlide].classList.remove('active');
                            img2.classList.add('active');
                            activeImageSlide = 1
                        img2.addEventListener("click", ()=>{
                            productImages[activeImageSlide].classList.remove('active');
                            img2.classList.add('active');
                            productImageSlide.style.backgroundImage = `url('${img2.src}')`;
                            activeImageSlide = 1;
                        })
                        
                    },"image/jpeg", 90);
                }  }  }  }
const previewPhoto3 = () => {
    const file = fileInput3.files;
    if (file) {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(file[0]);        
          fileReader.onload = event => {
            const previewImg = document.createElement("img"); 
            const imgUrl = event.target.result;
            previewImg.src = imgUrl;
                previewImg.onload = (e) => {
                   
                    const canvas = document.createElement("canvas")
                    const ratio = WIDTH /e.target.width;
                    canvas.width = WIDTH;
                    canvas.height = 500 //e.target.height * ratio;
                    const context = canvas.getContext("2d");
                    context.drawImage(previewImg, 0,0, canvas.width, canvas.height);
                    context.canvas.toBlob((blob) => {
                        new_Blob3 = blob;
                        const new_Img = document.createElement("img");
                        new_Img.setAttribute("id", "newImg");
                        const url = URL.createObjectURL(blob);
                        img3.src = url;
                        productImageSlide.style.backgroundImage = `url('${img3.src}')`;
                        productImages[activeImageSlide].classList.remove('active');
                            img3.classList.add('active');
                            activeImageSlide = 2
                        img3.addEventListener("click", ()=>{
                            productImages[activeImageSlide].classList.remove('active');
                            img3.classList.add('active');
                            productImageSlide.style.backgroundImage = `url('${img3.src}')`;
                            activeImageSlide = 2;
                        })
                        
                    },"image/jpeg", 90);
                } } } }
             

const previewPhoto4 = () => {
    const file = fileInput4.files;
    if (file) {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(file[0]);        
          fileReader.onload = event => {
            const previewImg = document.createElement("img"); 
            const imgUrl = event.target.result;
            previewImg.src = imgUrl;
                previewImg.onload = (e) => {
                    const canvas = document.createElement("canvas")
                    const ratio = WIDTH /e.target.width;
                    canvas.width = WIDTH;
                    canvas.height = 500 //e.target.height * ratio;
                    const context = canvas.getContext("2d");
                    context.drawImage(previewImg, 0,0, canvas.width, canvas.height);
                    context.canvas.toBlob((blob) => {
                        new_Blob4 = blob;
                        const new_Img = document.createElement("img");
                        new_Img.setAttribute("id", "newImg");
                        const url = URL.createObjectURL(blob);
                        img4.src = url;
                        productImageSlide.style.backgroundImage = `url('${img4.src}')`;
                        productImages[activeImageSlide].classList.remove('active');
                            img4.classList.add('active');
                            activeImageSlide = 3
                        img4.addEventListener("click", ()=>{
                            productImages[activeImageSlide].classList.remove('active');
                            img4.classList.add('active');
                            productImageSlide.style.backgroundImage = `url('${img4.src}')`;
                            activeImageSlide = 3;
                        })
                        
                    },"image/jpeg", 90);
                } } } }  
           

fileInput.addEventListener('change', previewPhoto);
fileInput2.addEventListener('change', previewPhoto2);
fileInput3.addEventListener('change', previewPhoto3);
fileInput4.addEventListener('change', previewPhoto4);

window.onload = formInput.addEventListener
    ('submit', (e) => {
     e.preventDefault();
     const size_s = document.getElementById('size_s');
     const size_m = document.getElementById('size_m');
     const size_l = document.getElementById('size_l');
     let smallSize = false;
     let mediumSize = false;
     let largeSize = false;
     
     if(size_s.checked) {
      smallSize = true
     }
     if (size_m.checked){
        mediumSize = true
     }
     if(size_l.checked){
        largeSize = true
     }    
   
     
     const short_description = document.getElementById('short_description')
     //feature not finshed
     //const sale_price = document.getElementById('sale_price')
    const description = document.getElementById('description')
    const category = document.getElementById('category')
    const brand = document.getElementById('brand');
    const price = document.getElementById('price');

    const formData = new FormData();
    formData.append("description", description.value);     
    formData.append("category", category.value);
    formData.append("brand", brand.value);
    formData.append("price", price.value); 
    formData.append("short_description", short_description.value)
   // formData.append("sale_price", sale_price.value)
    formData.append("sizes_s", smallSize)
    formData.append("sizes_m", mediumSize)
    formData.append("sizes_l", largeSize)
    formData.append("files", new_Blob, "Picture")
    formData.append("files", new_Blob2, "Picture2")
    formData.append("files", new_Blob3, "Picture3")
    formData.append("files", new_Blob4, "Picture4")
    fetch('/add-product', {
        method: 'post',
        body: formData,
        
        }).then((res) => window.location.reload())
        .catch(err => showAlert('Failed to upload'));
        

     

         })




