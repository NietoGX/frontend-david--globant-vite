import { Product } from './product';

export class ProductDetail extends Product {
    constructor({
        id, brand, model, price, imgUrl,
        cpu, ram, os, displayResolution, battery,
        primaryCamera, secondaryCmera, dimentions, weight, options
    }) {
        super({ id, brand, model, price, imgUrl });
        this.cpu = cpu;
        this.ram = ram;
        this.os = os;
        this.displayResolution = displayResolution;
        this.battery = battery;
        this.primaryCamera = primaryCamera;
        this.secondaryCmera = secondaryCmera;
        this.dimentions = dimentions;
        this.weight = weight;
        this.options = options;
    }
}
