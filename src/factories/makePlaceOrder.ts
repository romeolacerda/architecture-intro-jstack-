import { PlaceOrder } from "../useCases/PlaceOrder";
import { makeDyanmoOrdersRepository } from "./makeDyanmoOrdersRepository";
import { makeSESGateway } from "./makeSESGateway";
import { makeSQSGateway } from "./makeSQSGateway";

export function makePlaceOrder() {
    return new PlaceOrder(
        makeDyanmoOrdersRepository(),
        makeSQSGateway(),
        makeSESGateway()
    )
}
