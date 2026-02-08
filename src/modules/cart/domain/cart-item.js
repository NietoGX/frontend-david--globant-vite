export class CartItem {
    constructor({ id, colorCode, storageCode, price, quantity = 1 }) {
        this.id = id;
        this.colorCode = colorCode;
        this.storageCode = storageCode;
        this.price = price;
        this.quantity = quantity;
    }
}
