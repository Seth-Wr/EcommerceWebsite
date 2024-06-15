function Cart(oldCart){
this.items = oldCart.items || {};
this.totalQty = oldCart.totalQty || 0;
this.totalPrice = oldCart.totalPrice || 0;
this.add = function(item, id,size){
let storedItem = this.items[id + size];

if(!storedItem){
    storedItem = this.items[id + size] = {item: item, qty: 0, price: 0, size: size};
}

storedItem.qty++;
storedItem.price =  storedItem.item.price * storedItem.qty
this.totalPrice += storedItem.item.price;
this.totalQty ++;


};
this.generateArray = function(){
    const arr = [];
    for(let id in this.items){
        arr.push(this.items[id])
    }
    return arr;
}

}

module.exports = Cart