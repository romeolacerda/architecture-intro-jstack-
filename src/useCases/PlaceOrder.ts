import { Injectable } from "../di/Injectable";
import { Order } from "../entities/Order";
import { ConsoleLogGateway } from "../gateways/ConsoleLOgGateway";
import { SESGateway } from "../gateways/SESGataway";
import { SQSGateway } from "../gateways/SQSGateway";
import { DyanmoOrdersRepository } from "../repository/DynamoOrdersRepository";

@Injectable()
export class PlaceOrder {
    constructor(
        private readonly dyanmoOrdersRepository: DyanmoOrdersRepository,
        private readonly queueGateway: SQSGateway,
        private readonly emailGateway: SESGateway,
        private readonly logService: ConsoleLogGateway
    ) { }

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

        await this.logService.log({
            msg: 'log here'
        })

        return { orderId: order.id };
    }
}
