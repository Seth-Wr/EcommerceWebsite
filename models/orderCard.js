function orderCard (imgId,imgUrl,description,qty,totalPrice,size){
    this.imgId = imgId;
    this.imgUrl = imgUrl;
    this.description = description;
    this.qty = qty;
    this.totalPrice = totalPrice
    this.size = size
}


module.exports = {orderCard}