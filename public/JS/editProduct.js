const productImages = document.querySelectorAll(".product-images img")
const productImageSlide = document.querySelector(".image-slider");
const description =  document.querySelector(".des")
const brand = document.querySelector(".product-brand")
const sale_price = document.querySelector(".product-price")
const short_description = document.querySelector(".product-short-des")
const price = document.querySelector(".product-actual-price")
let activeImageSlide = 0;
const myKeysValues = window.location.search;
const urlParams = new URLSearchParams(myKeysValues);
const param1 = urlParams.get('imgId')
const size_Btns = [];
const size_Buttons = document.querySelector(".size_Buttons")
const sold_out_Btn = document.querySelector(".sold_out_Btn")
const editShortDesInput = document.getElementById("editShortDesInput")
const editShortDes = document.querySelector(".editShortDes")
const editPriceInput = document.getElementById("editPriceInput")
const editPrice = document.querySelector(".editPrice")
const editDesInput = document.getElementById("editDesInput")
const editDes = document.querySelector(".editDes")
const deleteSizeBtn = document.querySelectorAll(".deleteSize")
const addSizeBtn = document.querySelectorAll(".addSize")
const editImgBtn = document.querySelector(".editImgBtn")
let new_Blob;
const WIDTH = 400;
const submitBtns = document.querySelector(".submitBtns")
const imgEventInstance = []
const imgIds = []
let activeImgId
function showAlert(msg){
    let alertBox = document.querySelector('.alert-box');
    let alertMsg = document.querySelector('.alert-msg');
    alertMsg.innerHTML = msg;
    alertBox.classList.add('show');
    setTimeout(() =>{
        alertBox.classList.remove('show');
    }, 1000);
}



const processData = (data) =>{
    
    short_description.textContent = data.short_description
    description.textContent = data.description
    brand.textContent = data.brand
    productImages[0].src = data.img1idurl;
    productImages[1].src = data.img2idurl;
    productImages[2].src = data.img3idurl;
    productImages[3].src = data.img4idurl;
    productImages[0].classList.add('active')
    imgIds.push(data.img1id,data.img2id,data.img3id,data.img4id)
    activeImgId = imgIds[0]
    productImageSlide.style.backgroundImage = `url('${data.img1idurl}')`;
    if(data.sold_out == true){
        document.querySelector(".sold_out_text").classList.add("sold_out")
        sold_out_Btn.value = `false`
        sold_out_Btn.innerHTML = `Restock`
    }
    if (data.sale_price == null || data.sale_price == 0){
        sale_price.textContent = data.price
    }
    else{
        sale_price.textContent = data.sale_price
        price.textContent = data.price
    }
    const urlParam1 = "?imgId="+ data.img1id
    
    createButtons(data.sizes_s,data.sizes_m,data.sizes_l)

    sold_out_Btn.addEventListener('click', () => {
        const urlParam2 = `&sold_out=`+ sold_out_Btn.value.toString()
        fetch('/sold_out_product'+urlParam1 + urlParam2,{
            method: 'put',
            headers: {'Content-Type': 'application/json'}
        })
        .then((res) => { if(res.status == 201){
            window.location.reload()
        }
        else{
            
        }
        }).catch(err => showAlert("Unexpected Error"));
       
    }) 

    editShortDes.addEventListener('click', () =>{
        const edit = editShortDesInput.value
        const input = {edit}
        console.log(JSON.stringify(input))
          fetch('/editText'+"?column=short_description"+"&imgId="+data.img1id,{
                method: 'put',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(input)
            }).then((res) => { console.log(res)
                 if(res.status == 201) {
                window.location.reload()
            }
        }).catch(err => showAlert('Failed to edit'));
        
         
    })
    editDes.addEventListener('click', () =>{
        const edit = editDesInput.value
            const input = {edit};
            fetch('/editText'+"?column=description"+"&imgId="+data.img1id,{
                method: 'put',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(input)
            }).then((res) => { console.log(res)
                 if(res.status == 201) {
                window.location.reload()
            }
        }).catch(err => showAlert('Failed to edit'));
        
    })
    editPrice.addEventListener('click', () =>{
        let edit = editPriceInput.value
            const input = {edit};
            fetch('/editText'+"?column=price"+"&imgId="+data.img1id,{
                method: 'put',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(input)
            }).then((res) => { console.log(res)
                 if(res.status == 201) {
                window.location.reload()
            }
        }).catch(err => showAlert('Failed to edit'));
        
    })

        deleteSizeBtn.forEach((item,i)=>{
            item.addEventListener('click', () =>{
            const edit = false 
            const input = {edit};
            fetch('/editText'+"?column="+item.value+"&imgId="+data.img1id,{
                method: 'put',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(input)
            }).then((res) => { console.log(res)
                 if(res.status == 201) {
                window.location.reload()
            }
        }).catch(err => showAlert('Failed to edit'));
            })
        })
        addSizeBtn.forEach((item,i)=>{
            item.addEventListener('click', () =>{
            const edit = true 
            const input = {edit};
            fetch('/editText'+"?column="+item.value+"&imgId="+data.img1id,{
                method: 'put',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(input)
            }).then((res) => { console.log(res)
                 if(res.status == 201) {
                window.location.reload()
            }
        }).catch(err => showAlert('Failed to edit'));
            })
        })
        editImgBtn.addEventListener('change', previewPhoto);


    }
const imageSlide = (item,i) => {
        productImages[activeImageSlide].classList.remove('active');
        item.classList.add('active');
        productImageSlide.style.backgroundImage = `url('${item.src}')`;
        activeImageSlide = i;
        activeImgId = imgIds[i]
}
const imgEventListeners = () =>{
    imgEventInstance.splice(0, imgEventInstance.length)
productImages.forEach((item, i) =>{
    let eventInstance = imageSlide.bind(this,item,i)
    item.addEventListener('click', eventInstance) 
    imgEventInstance.push(eventInstance)
})
}

imgEventListeners()

const previewPhoto = () => {
    const file = editImgBtn.files;
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
                        productImageSlide.style.backgroundImage = `url('${url}')`;
                        submitBtns.innerHTML = `
                        <button class ="submitBtn">Confirm Change Photo</button>
                        <br>
                        <button class="cancelBtn">Cancel</button>
                        `
                        const submitBtn = document.querySelector(".submitBtn")
                        const cancelBtn = document.querySelector(".cancelBtn")
                        submitBtn.addEventListener('click', () => {
                            console.log("submit")
                            const formData = new FormData();
                            formData.append('file', new_Blob)
                            fetch('/editProductImg'+"?imgId="+activeImgId,{
                                method: 'put',
                                body: formData,
                        }).then((res) => {
                            if (res.status == 201){
                                window.location.reload()
                            }
                        }).catch(err => showAlert('Failed to edit'));
                            
                        })
                        cancelBtn.addEventListener('click', () =>{
                            console.log("cancel")
                            productImageSlide.style.backgroundImage = `url('${document.querySelector(".active").src}')`
                            imgEventListeners();
                            submitBtn.remove();
                            cancelBtn.remove();
                        })
                    for(i=0;i<imgEventInstance.length;i++){
                        productImages[i].removeEventListener('click',imgEventInstance[i])
                    }
                           
                    },"image/jpeg", 90);
                }    

        }
    }
} 



const createButtons = (small, medium, large) =>{
    if(small){
        const button = new String(`
        
        <input type="radio" name="size" value="s" checked hidden id="s-size">
        <label for="s-size" class="size-radio-btn">s</label>
        `)
      size_Btns.push(button)
    } 
    if(medium){
        const button = new String(`
        <input type="radio" name="size" value="m" hidden id="m-size">
            <label for="m-size" class="size-radio-btn">m</label>     
        `)
      size_Btns.push(button)
    } 
    if(large){
        const button = new String(`    
        <input type="radio" name="size" value="l" hidden id="l-size">
        <label for="l-size" class="size-radio-btn">l</label>
        `)
      size_Btns.push(button)
    } 
    size_Buttons.innerHTML = size_Btns.toString();
    const sizeBtns = document.querySelectorAll('.size-radio-btn');
    let checkedBtn = 0;

    sizeBtns.forEach((item, i) => {
    item.addEventListener('click', () => {
        sizeBtns[checkedBtn].classList.remove('check');
        item.classList.add('check');
        checkedBtn = i; 
     
    })
})
}


const startFunction = () =>{
    fetch('/product_page'+myKeysValues)
    .then((res) => res.json())
    .then((res) => processData(res))
    .catch(err => showAlert('Failed to load'));
    };
    

    
   startFunction()