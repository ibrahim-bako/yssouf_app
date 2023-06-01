import { Failure } from "../Failure"
import { SellInvoice } from "../entities/SellInvoice"

export abstract class SellInvoiceRepository {
  abstract get(id: number): Promise<Failure | SellInvoice>
  abstract filterByConsumer(consumerId: number): Promise<Failure | SellInvoice[]>
  abstract add(sell_invoice: SellInvoice): Promise<Failure | SellInvoice>
  abstract remove(id: number): Promise<Failure | void>
  abstract update(sell_invoice: SellInvoice): Promise<Failure | SellInvoice>
  abstract getBetweenDates(min: Date, max: Date): Promise<Failure | SellInvoice[]>
  abstract getByConsumerBetweenDatesWithProducts(
    consumerId: number,
    min: Date,
    max: Date
  ): Promise<Failure | SellInvoice[]>
  abstract getBetweenDatesWithProducts(min: Date, max: Date): Promise<Failure | SellInvoice[]>
}
