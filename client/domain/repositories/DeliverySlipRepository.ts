import { Failure } from "../Failure"
import { DeliverySlip } from "../entities/DeliverySlip"

export abstract class DeliverySlipRepository {
  abstract get(id: number): Promise<Failure | DeliverySlip>
  abstract filterByProvider(providerId: number): Promise<Failure | DeliverySlip[]>
  abstract add(delivery_note: DeliverySlip): Promise<Failure | DeliverySlip>
  abstract remove(id: number): Promise<Failure | void>
  abstract update(delivery_note: DeliverySlip): Promise<Failure | DeliverySlip>
  abstract getBetweenDates(min: Date, max: Date): Promise<Failure | DeliverySlip[]>
}
