import { SendEmailCommand, SESClient } from "@aws-sdk/client-ses";
import { SendMessageCommand, SQSClient } from "@aws-sdk/client-sqs";
import { Order } from "../entities/Order";
import { DyanmoOrdersRepository } from "../repository/DynamoOrdersRepository";
import { SQSGateway } from "../gateways/SQSGateway";
import { SESGateway } from "../gateways/SESGataway";

export class PlaceOrder {
    async execute() {
        const customerEmail = "romeolacerdafarias@gmail.com";
        const amount = Math.ceil(Math.random() * 1000);

        const order = new Order(customerEmail, amount);
        const dyanmoOrdersRepository = new DyanmoOrdersRepository();
        const sqsGateway = new SQSGateway();
        const sesGateway = new SESGateway();
        // Order on Db
        await dyanmoOrdersRepository.create(order);

        // Payment on Queue
        await sqsGateway.publishMessage({ orderId: order.id });

        //confirmation email
        await sesGateway.sendEmail({
            from: "Roma <noreply@romeo.dev.br>",
            to: [customerEmail],
            subject: `Pedido #${order.id} confirmed`,
            html: `
            <h1>Your order has been confirmed</h1>
                        <p>Thanks!</p>`,
        });

        return { orderId: order.id };
    }
}
