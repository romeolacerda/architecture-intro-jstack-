 import fastify from "fastify";
import { container } from "./di/container";
import { SESGateway } from "./gateways/SESGataway";
import { SQSGateway } from "./gateways/SQSGateway";
import { DyanmoOrdersRepository } from "./repository/DynamoOrdersRepository";
import { PlaceOrder } from "./useCases/PlaceOrder";

const app = fastify();

app.post("/orders", async (request, reply) => {

    const placeOrder = new PlaceOrder(
        container.resolve(DyanmoOrdersRepository),
        container.resolve(SQSGateway),
        container.resolve(SESGateway),
    )
    const { orderId } = await placeOrder.execute();

    reply.status(201).send({ orderId });
});

app.listen({ port: 3000 }).then(() => {
    console.log("🔥 Server running at http://localhost:3000");
});
