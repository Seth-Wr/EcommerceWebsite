function ProductCard (imgId,imgUrl,description,brand,price,category,sold_out){
    this.imgId = imgId;
    this.imgUrl = imgUrl;
    this.description = description;
    this.brand = brand;
    this.price = price;
    this.category = category;
    this.sold_out = sold_out
}


module.exports = {ProductCard}