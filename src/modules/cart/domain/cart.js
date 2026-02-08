import { CartItem } from './cart-item';

export class Cart {
    constructor({ items = [] } = {}) {
        this.items = items.map(item => new CartItem(item));
    }

    addItem(item) {
        this.items.push(item);
    }

    getTotalItems() {
        return this.items.reduce((acc, item) => acc + item.quantity, 0);
    }
}
