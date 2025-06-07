import { SESGateway } from "../gateways/SESGataway";
import { SQSGateway } from "../gateways/SQSGateway";
import { DyanmoOrdersRepository } from "../repository/DynamoOrdersRepository";
import { Registry } from "./Registry";

export const container = Registry.getInstance()

container.register(DyanmoOrdersRepository)
container.register(SQSGateway)
container.register(SESGateway)
