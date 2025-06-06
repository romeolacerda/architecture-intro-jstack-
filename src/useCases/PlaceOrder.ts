import { Order } from "../entities/Order";
import { SESGateway } from "../gateways/SESGataway";
import { SQSGateway } from "../gateways/SQSGateway";
import { DyanmoOrdersRepository } from "../repository/DynamoOrdersRepository";

export class PlaceOrder {
    constructor(
        private readonly dyanmoOrdersRepository: DyanmoOrdersRepository,
        private readonly sqsGateway: SQSGateway,
        private readonly sesGateway: SESGateway,
    ) { }

    async execute(
    ) {
        const customerEmail = "romeolacerdafarias@gmail.com";
        const amount = Math.ceil(Math.random() * 1000);

        const order = new Order(customerEmail, amount);
        // Order on Db
        await this.dyanmoOrdersRepository.create(order);

        // Payment on Queue
        await this.sqsGateway.publishMessage({ orderId: order.id });

        //confirmation email
        await this.sesGateway.sendEmail({
            from: "Romeo <noreply@romeo.dev.br>",
            to: [customerEmail],
            subject: `Pedido #${order.id} confirmed`,
            html: `
            <h1>Your order has been confirmed</h1>
                        <p>Thanks!</p>`,
        });

        return { orderId: order.id };
    }
}
