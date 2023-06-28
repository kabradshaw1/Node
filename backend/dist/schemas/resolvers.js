"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_express_1 = require("apollo-server-express");
const models_1 = require("../models");
const auth_1 = require("../utils/auth");
const resolver = {
    Query: {
        user: (parent, args, context) => __awaiter(void 0, void 0, void 0, function* () {
            if (context.user && context.user._id) {
                const user = yield models_1.User.findById(context.user._id);
                return user;
            }
            throw new apollo_server_express_1.AuthenticationError('Not logged in');
        })
    },
    Mutation: {
        addUser: (parent, args) => __awaiter(void 0, void 0, void 0, function* () {
            const user = yield models_1.User.create(args);
            const token = (0, auth_1.signToken)(user);
            return { token, user };
        }),
        login: (parent, { email, password }) => __awaiter(void 0, void 0, void 0, function* () {
            const user = yield models_1.User.findOne({ email });
            if (!user) {
                throw new apollo_server_express_1.AuthenticationError('Incorrect credentials');
            }
            const correctPw = yield user.isCorrectPassword(password);
            if (!correctPw) {
                throw new apollo_server_express_1.AuthenticationError('Incorrect credentials');
            }
            const token = (0, auth_1.signToken)(user);
            return { token, user };
        })
    },
};
exports.default = resolver;
