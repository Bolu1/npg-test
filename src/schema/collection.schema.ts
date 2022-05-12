import {number, object, string, TypeOf} from 'zod'

export const createProductSchema = object({
    body: object({
        name: string({
            required_error:'Name is required'
        }),
        price: number({
            required_error: 'Price is required'
        }),
        quantity: number({
            required_error: 'Quantity is required'
        }),
        description: string({
            required_error:'Description is required'
        }),
        colors: string({
            required_error: 'Colors are required'
        }),
        sizes: string({
            required_error: 'Sizes are required'
        }),
        image1: string({
            required_error: 'image is required'
        }),
        image2: string({
            required_error: 'image is required'
        }),
        image3: string({
            required_error: 'image is required'
        }),

    })
})

export type createProductInput = TypeOf<typeof createProductSchema>