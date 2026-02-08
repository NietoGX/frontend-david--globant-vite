import { z } from 'zod';

export const AddToCartResponseSchema = z.object({
    count: z.number(),
});
