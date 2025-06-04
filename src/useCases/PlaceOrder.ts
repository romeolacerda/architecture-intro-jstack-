import { randomUUID } from "node:crypto";

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { SendEmailCommand, SESClient } from "@aws-sdk/client-ses";
import { SendMessageCommand, SQSClient } from "@aws-sdk/client-sqs";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";

export class PlaceOrder {
    async execute() {
        const customerEmail = "romeolacerdafarias@gmail.com";
        const amount = Math.ceil(Math.random() * 1000);
        const orderId = randomUUID();

        // Order on Db
        const ddbClient = DynamoDBDocumentClient.from(new DynamoDBClient());
        const putItemCommand = new PutCommand({
            TableName: "Orders",
            Item: {
                id: orderId,
                email: customerEmail,
                amount,
            },
        });

        await ddbClient.send(putItemCommand);

        // Payment on Queue
        const sqsClient = new SQSClient();
        const sendMessageCommand = new SendMessageCommand({
            QueueUrl:
                "https://sqs.us-east-1.amazonaws.com/620214273403/ProcessPaymentQueue",
            MessageBody: JSON.stringify({ orderId }),
        });

        await sqsClient.send(sendMessageCommand);

        //confirmation email
        const sesClient = new SESClient({ region: "us-east-2" });
        const sendEmailCommand = new SendEmailCommand({
            Source: "Roma <noreply@romeo.dev.br>",
            Destination: {
                ToAddresses: [customerEmail],
            },
            Message: {
                Subject: {
                    Charset: "utf-8",
                    Data: `Pedido #${orderId} confirmed`,
                },
                Body: {
                    Html: {
                        Charset: "utf-8",
                        Data: `
                        <h1>Your order has been confirmed</h1>

                        <p>Thanks!</p>
                        `,
                    },
                },
            },
        });

        await sesClient.send(sendEmailCommand);

        return { orderId };
    }
}
