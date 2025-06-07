import { SendMessageCommand, SQSClient } from "@aws-sdk/client-sqs";
import { IQueueGateway } from "../interfaces/gateways/IQueueGateway";

export class SQSGateway implements IQueueGateway {
    private client = new SQSClient();
    async publishMessage(message: Record<string, unknown>): Promise<void> {
        const sendMessageCommand = new SendMessageCommand({
            QueueUrl:
                "https://sqs.us-east-1.amazonaws.com/620214273403/ProcessPaymentQueue",
            MessageBody: JSON.stringify(message),
        });

        await this.client.send(sendMessageCommand);
    }
}
