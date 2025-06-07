import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { Order } from "../entities/Order";
import { IOrdersRepository } from "../interfaces/repositories/IOrdersRepository";

export class DyanmoOrdersRepository implements IOrdersRepository {
    private client = DynamoDBDocumentClient.from(new DynamoDBClient());

    async create(order: Order): Promise<void> {
        const command = new PutCommand({
            TableName: "Orders",
            Item: order,
        });

        await this.client.send(command);
    }
}
