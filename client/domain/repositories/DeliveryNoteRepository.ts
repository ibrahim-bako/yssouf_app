import { Failure } from "../Failure"
import { DeliveryNote } from "../entities/DeliveryNote"

export abstract class DeliveryNoteRepository {
  abstract get(id: number): Promise<Failure | DeliveryNote>
  abstract filterByConsumer(consumerId: number): Promise<Failure | DeliveryNote[]>
  abstract add(delivery_note: DeliveryNote): Promise<Failure | DeliveryNote>
  abstract remove(id: number): Promise<Failure | void>
  abstract update(delivery_note: DeliveryNote): Promise<Failure | DeliveryNote>
  abstract getBetweenDates(min: Date, max: Date): Promise<Failure | DeliveryNote[]>
}
