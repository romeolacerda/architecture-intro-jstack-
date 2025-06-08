import { ConsoleLogGateway } from "../gateways/ConsoleLOgGateway";
import { SESGateway } from "../gateways/SESGataway";
import { SQSGateway } from "../gateways/SQSGateway";
import { DynamoOrdersRepository } from "../repository/DynamoOrdersRepository";
import { PlaceOrder } from "../useCases/PlaceOrder";
import { Registry } from "./Registry";

export const container = Registry.getInstance()

container.register('PlaceOrder', PlaceOrder)
container.register('OrdersRepository', DynamoOrdersRepository)
container.register('QueueGateway', SQSGateway)
container.register('EmailGateway', SESGateway)
container.register('LogGateway', ConsoleLogGateway)
