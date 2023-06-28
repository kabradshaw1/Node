"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signToken = exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const secret = 'mysecretsshhhhh';
const expiration = '2h';
const authMiddleware = function ({ req }) {
    let token = req.body.token || req.query.token || req.headers.authorization;
    if (req.headers.authorization) {
        token = token.split(' ').pop().trim();
    }
    if (!token) {
        return req;
    }
    try {
        const { data } = jsonwebtoken_1.default.verify(token, secret, { maxAge: expiration });
        req.user = data;
    }
    catch (_a) {
        console.log('Invalid token');
    }
    return req;
};
exports.authMiddleware = authMiddleware;
const signToken = function ({ username, email, _id }) {
    const payload = { username, email, _id };
    return jsonwebtoken_1.default.sign({ data: payload }, secret, { expiresIn: expiration });
};
exports.signToken = signToken;
