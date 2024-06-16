const fileInput = document.getElementById('picture');
const fileInput2 = document.getElementById('picture2');
const fileInput3 = document.getElementById('picture3');
const fileInput4 = document.getElementById('picture4');
const formInput = document.getElementById('form');
const getBtn = document.querySelector('.button');
const WIDTH = 400;
const wrapper = document.getElementById('wrapper')
const wrapper2 = document.getElementById('wrapper2')
const wrapper3 = document.getElementById('wrapper3')
const wrapper4 = document.getElementById('wrapper4')
let new_Blob;
let new_Blob2;
let new_Blob3;
let new_Blob4;



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
                   
                    if(wrapper.childElementCount > 0){
                        
                        wrapper.removeChild(document.getElementById("newImg"))
                    }
                    const canvas = document.createElement("canvas")
                    const ratio = WIDTH /e.target.width;
                    canvas.width = WIDTH;
                    canvas.height = 500 //e.target.height * ratio;
                    const context = canvas.getContext("2d");
                    context.drawImage(previewImg, 0,0, canvas.width, canvas.height);
                    context.canvas.toBlob((blob) => {
                        new_Blob = blob;
                        const new_Img = document.createElement("img");
                        new_Img.setAttribute("id", "newImg");
                        const url = URL.createObjectURL(blob);
                        new_Img.src = url;
                        wrapper.appendChild(new_Img);
                        
                    },"image/jpeg", 90);
                    
                
                    
                 
                  
                }    

        }
       
        
    }
} 

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
                   
                    if(wrapper2.childElementCount > 0){
                        
                        wrapper2.removeChild(document.getElementById("newImg"))
                    }
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
                        new_Img.src = url;
                        wrapper2.appendChild(new_Img);
                        
                    },"image/jpeg", 90);
                    
                
                    
                 
                  
                }    

        }
       
        
    }
} 

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
                   
                    if(wrapper3.childElementCount > 0){
                        
                        wrapper3.removeChild(document.getElementById("newImg"))
                    }
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
                        new_Img.src = url;
                        wrapper3.appendChild(new_Img);
                        
                    },"image/jpeg", 90);
                    
                
                    
                 
                  
                }    

        }
       
        
    }
} 

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
                   
                    if(wrapper4.childElementCount > 0){
                        
                        wrapper4.removeChild(document.getElementById("newImg"))
                    }
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
                        new_Img.src = url;
                        wrapper4.appendChild(new_Img);
                        
                    },"image/jpeg", 90);
                    
                
                    
                 
                  
                }    

        }
       
        
    }
} 

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
        
        }).then((res) => console.log(res))
        .then((res) => window.location.reload())
        .catch((err) => ("Error occured", err));
        

     

         })


getBtn.addEventListener('click', () => {
    fetch('/products')
    .then((res) => console.log(res))
}); 

const startFunction = () =>{
fetch('/products')
.then((res) => res.json())
.then((res) => console.log(res))
};

