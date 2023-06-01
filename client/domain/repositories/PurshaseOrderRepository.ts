import { Failure } from "../Failure"
import { PurshaseOrder } from "../entities/PurshaseOrder"

export abstract class PurshaseOrderRepository {
  abstract get(id: number): Promise<Failure | PurshaseOrder>
  abstract filterByProvider(providerId: number): Promise<Failure | PurshaseOrder[]>
  abstract add(sell_invoice: PurshaseOrder): Promise<Failure | PurshaseOrder>
  abstract remove(id: number): Promise<Failure | void>
  abstract update(sell_invoice: PurshaseOrder): Promise<Failure | PurshaseOrder>
  abstract getBetweenDates(min: Date, max: Date): Promise<Failure | PurshaseOrder[]>
  abstract getByProviderBetweenDatesWithProducts(
    providerId: number,
    min: Date,
    max: Date
  ): Promise<Failure | PurshaseOrder[]>
  abstract getBetweenDatesWithProducts(min: Date, max: Date): Promise<Failure | PurshaseOrder[]>
}
