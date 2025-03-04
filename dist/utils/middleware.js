"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authenticate = (req, res, next) => {
    var _a;
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
    if (!token)
        return res.status(401).json({ message: 'No token provided' });
    jsonwebtoken_1.default.verify(token, 'your_jwt_secret', (err, decoded) => {
        console.log("FIRED!");
        if (err)
            return res.status(401).json({ message: 'Invalid token' });
        console.log("FIRED!!");
        req.userId = decoded.id;
        console.log(decoded.id);
        next();
    });
};
exports.authenticate = authenticate;
