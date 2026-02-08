import { z } from 'zod';

export const ProductDtoSchema = z.object({
    id: z.string(),
    brand: z.string(),
    model: z.string(),
    price: z.union([z.string(), z.number()]).transform(val => val.toString()),
    imgUrl: z.string().optional(),
});

export const ProductDetailDtoSchema = ProductDtoSchema.extend({
    cpu: z.string(),
    ram: z.string(),
    os: z.string(),
    displayResolution: z.string().optional(),
    battery: z.string().optional(),
    primaryCamera: z.union([z.string(), z.array(z.string())]).optional(),
    secondaryCmera: z.union([z.string(), z.array(z.string())]).optional(),
    dimentions: z.string().optional(),
    weight: z.string().optional(),
    options: z.object({
        colors: z.array(z.object({
            code: z.number(),
            name: z.string()
        })),
        storages: z.array(z.object({
            code: z.number(),
            name: z.string()
        }))
    })
});

export const ProductListDtoSchema = z.array(ProductDtoSchema);
