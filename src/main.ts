import fastify from "fastify";
import { PlaceOrder } from "./useCases/PlaceOrder";
import { DyanmoOrdersRepository } from "./repository/DynamoOrdersRepository";
import { SQSGateway } from "./gateways/SQSGateway";
import { SESGateway } from "./gateways/SESGataway";

const app = fastify();

app.post("/orders", async (request, reply) => {
    const dyanmoOrdersRepository = new DyanmoOrdersRepository()
    const sqsGateway = new SQSGateway()
    const sesGateway = new SESGateway()

    const placeOrder = new PlaceOrder(
        dyanmoOrdersRepository,
        sqsGateway,
        sesGateway
    );
    const { orderId } = await placeOrder.execute();

    reply.status(201).send({ orderId });
});

app.listen({ port: 3000 }).then(() => {
    console.log("🔥 Server running at http://localhost:3000");
});
