import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { Order } from "../entities/Order";
import { IOrdersRepository } from "../interfaces/repositories/IOrdersRepository";
import { Injectable } from "../di/Injectable";
import { ILogGateway } from "../interfaces/gateways/ILogGateway";
import { ConsoleLogGateway } from "../gateways/ConsoleLOgGateway";

@Injectable()
export class DyanmoOrdersRepository implements IOrdersRepository {
    private client = DynamoDBDocumentClient.from(new DynamoDBClient());

    constructor(private readonly logGateway: ConsoleLogGateway) { }

    async create(order: Order): Promise<void> {
        const command = new PutCommand({
            TableName: "Orders",
            Item: order,
        });

        await this.logGateway.log({
            ...order
        })

        await this.client.send(command);
    }
}
