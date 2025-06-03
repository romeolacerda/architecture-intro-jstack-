"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlaceOrder = void 0;
const node_crypto_1 = require("node:crypto");
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const client_ses_1 = require("@aws-sdk/client-ses");
const client_sqs_1 = require("@aws-sdk/client-sqs");
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
class PlaceOrder {
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            const customerEmail = "romeolacerdafarias@gmail.com";
            const amount = Math.ceil(Math.random() * 1000);
            const orderId = (0, node_crypto_1.randomUUID)();
            // Order on Db
            const ddbClient = lib_dynamodb_1.DynamoDBDocumentClient.from(new client_dynamodb_1.DynamoDBClient());
            const putItemCommand = new lib_dynamodb_1.PutCommand({
                TableName: 'Orders',
                Item: {
                    id: orderId,
                    email: customerEmail,
                    amount,
                }
            });
            yield ddbClient.send(putItemCommand);
            // Payment on Queue
            const sqsClient = new client_sqs_1.SQSClient();
            const sendMessageCommand = new client_sqs_1.SendMessageCommand({
                QueueUrl: 'https://sqs.us-east-1.amazonaws.com/620214273403/ProcessPaymentQueue',
                MessageBody: JSON.stringify({ orderId })
            });
            yield sqsClient.send(sendMessageCommand);
            //confirmation email
            const sesClient = new client_ses_1.SESClient({ region: 'us-east-2' });
            const sendEmailCommand = new client_ses_1.SendEmailCommand({
                Source: 'Roma <noreply@romeo.dev.br>',
                Destination: {
                    ToAddresses: [customerEmail],
                },
                Message: {
                    Subject: {
                        Charset: 'utf-8',
                        Data: `Pedido #${orderId} confirmed`
                    },
                    Body: {
                        Html: {
                            Charset: 'utf-8',
                            Data: `
                        <h1>Your order has been confirmed</h1>

                        <p>Thanks!</p>
                        `
                        }
                    }
                }
            });
            yield sesClient.send(sendEmailCommand);
            return { orderId };
        });
    }
}
exports.PlaceOrder = PlaceOrder;
