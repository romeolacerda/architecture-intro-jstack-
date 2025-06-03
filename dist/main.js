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
const fastify_1 = __importDefault(require("fastify"));
const PlaceOrder_1 = require("./useCases/PlaceOrder");
const app = (0, fastify_1.default)();
app.post('/orders', (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    const placeOrder = new PlaceOrder_1.PlaceOrder();
    const { orderId } = yield placeOrder.execute();
    reply.status(201).send({ orderId });
}));
app.listen({ port: 3000 })
    .then(() => {
    console.log('🔥 Server running at http://localhost:3000');
});
