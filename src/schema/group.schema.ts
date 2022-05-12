// import {number, object, string, TypeOf, array} from 'zod'

// export const createOrderSchema = object({
//     body: object({
//         userId: string({
//             required_error:'user id required'
//         }),
//         orderItems: array({

//         }),
//         shippingAddress: string({
//             required_error: 'shipping address is required'
//         }),
//         paymentMethod: string({
//             required_error: 'payment method address is required'
//         }),
//         itemsPrice: number({
//             required_error: 'items price is required'
//         }),
//         shippingPrice: number({
//             required_error: 'shipping price is required'
//         }),
//         totalPrice: number({
//             required_error: 'total price is required'
//         })
//     })
// })

// export type createOrderInput = TypeOf<typeof createOrderSchema>