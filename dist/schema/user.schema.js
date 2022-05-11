"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.signinSchema = exports.createUserSchema = void 0;
const zod_1 = require("zod");
exports.createUserSchema = (0, zod_1.object)({
    body: (0, zod_1.object)({
        email: (0, zod_1.string)({
            required_error: 'email is  required'
        }).email('Not a valid email'),
        password: (0, zod_1.string)({
            required_error: 'password is  required'
        }).min(6, "Password too short "),
        firstname: (0, zod_1.string)({
            required_error: 'FirstName is  required'
        }),
        confirmPassword: (0, zod_1.string)({
            required_error: 'confirm password is  required'
        }),
        lastname: (0, zod_1.string)({
            required_error: 'LastName is  required'
        }),
        phone: (0, zod_1.string)({
            required_error: 'Phone number is required'
        })
    })
});
exports.signinSchema = (0, zod_1.object)({
    body: (0, zod_1.object)({
        email: (0, zod_1.string)({
            required_error: 'email is required'
        }),
        password: (0, zod_1.string)({
            required_error: 'password is required'
        })
    })
});
