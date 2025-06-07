import { Order } from "../entities/Order";
import { IEmailGateway } from "../interfaces/gateways/IEmailGateway";
import { IQueueGateway } from "../interfaces/gateways/IQueueGateway";
import { IOrdersRepository } from "../interfaces/repositories/IOrdersRepository";

export class PlaceOrder {
    constructor(
        private readonly dyanmoOrdersRepository: IOrdersRepository,
        private readonly queueGateway: IQueueGateway,
        private readonly emailGateway: IEmailGateway,
    ) {}

    async execute() {
        const customerEmail = "romeolacerdafarias@gmail.com";
        const amount = Math.ceil(Math.random() * 1000);

        const order = new Order(customerEmail, amount);

        await this.dyanmoOrdersRepository.create(order);

        await this.queueGateway.publishMessage({ orderId: order.id });

        await this.emailGateway.sendEmail({
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
