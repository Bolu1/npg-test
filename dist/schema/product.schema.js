"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProductSchema = void 0;
const zod_1 = require("zod");
exports.createProductSchema = (0, zod_1.object)({
    body: (0, zod_1.object)({
        name: (0, zod_1.string)({
            required_error: 'Name is required'
        }),
        price: (0, zod_1.number)({
            required_error: 'Price is required'
        }),
        quantity: (0, zod_1.number)({
            required_error: 'Quantity is required'
        }),
        description: (0, zod_1.string)({
            required_error: 'Description is required'
        }),
        colors: (0, zod_1.string)({
            required_error: 'Colors are required'
        }),
        sizes: (0, zod_1.string)({
            required_error: 'Sizes are required'
        }),
        image1: (0, zod_1.string)({
            required_error: 'image is required'
        }),
        image2: (0, zod_1.string)({
            required_error: 'image is required'
        }),
        image3: (0, zod_1.string)({
            required_error: 'image is required'
        }),
    })
});
