"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolvers = exports.typeDefs = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const resolvers_1 = __importDefault(require("./resolvers"));
exports.resolvers = resolvers_1.default;
const typeDefs = fs_1.default.readFileSync(path_1.default.join(__dirname, './typeDefs.graphql'), 'utf8');
exports.typeDefs = typeDefs;
