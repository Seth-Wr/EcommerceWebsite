function ProductCard (imgId,imgUrl,description,brand,price,category){
    this.imgId = imgId;
    this.imgUrl = imgUrl;
    this.description = description;
    this.brand = brand;
    this.price = price;
    this.category = category;
}


module.exports = {ProductCard}