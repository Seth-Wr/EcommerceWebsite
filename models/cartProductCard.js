function cartProductCard (imgId,imgUrl,description,price,qty,unitPrice,size,sale_price){
    this.imgId = imgId;
    this.imgUrl = imgUrl;
    this.description = description;
    this.price = price;
    this.qty = qty;
    this.unitPrice = unitPrice
    this.size = size
    this.sale_price = sale_price
}


module.exports = {cartProductCard}