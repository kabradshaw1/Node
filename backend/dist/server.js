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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const apollo_server_express_1 = require("apollo-server-express");
const path_1 = __importDefault(require("path"));
const schemas_1 = require("./schemas");
const auth_1 = require("./utils/auth");
const connection_1 = __importDefault(require("./config/connection"));
const PORT = process.env.PORT || 3001;
const app = (0, express_1.default)();
const server = new apollo_server_express_1.ApolloServer({
    typeDefs: schemas_1.typeDefs,
    resolvers: schemas_1.resolvers,
    context: auth_1.authMiddleware
});
app.use(express_1.default.urlencoded({ extended: false }));
app.use(express_1.default.json());
app.use('/images', express_1.default.static(path_1.default.join(__dirname, '../client/images')));
if (process.env.NODE_ENV === 'production') {
    app.use(express_1.default.static(path_1.default.join(__dirname, '../client/build')));
}
app.get('/', (req, res) => {
    res.sendFile(path_1.default.join(__dirname, '../client/build/index.html'));
});
const startApolloServer = (typeDefs, resolvers) => __awaiter(void 0, void 0, void 0, function* () {
    yield server.start();
    server.applyMiddleware({ app });
    connection_1.default.once('open', () => {
        app.listen(PORT, () => {
            console.log(`API server running on port ${PORT}!`);
            console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
        });
    });
});
startApolloServer(schemas_1.typeDefs, schemas_1.resolvers);
