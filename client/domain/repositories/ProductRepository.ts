import { Failure } from "../Failure"
import { Product } from "../entities/Product"

export abstract class ProductRepository {
  abstract get(id: number): Promise<Failure | Product>
  abstract getBetweenDates(minDate: Date, maxDate: Date): Promise<Failure | Product[]>
  abstract remove(id: number): Promise<Failure | void>
  abstract add(product: Product): Promise<Failure | Product>
  abstract addMany(products: Product[]): Promise<Failure | Product[]>
  abstract getByDeliveryNote(deliveryNoteId: number): Promise<Failure | Product[]>
  abstract getBySellInvoice(sellInvoiceId: number): Promise<Failure | Product[]>
  abstract getBySellInvoiceBetweenDates(minDate: Date, maxDate: Date): Promise<Failure | Product[]>
  abstract getByDeliverySlip(deliverySlipId: number): Promise<Failure | Product[]>
  abstract getByPurshadeOrder(purshadeOrderId: number): Promise<Failure | Product[]>
  abstract getByPurshadeOrderBetweenDates(
    minDate: Date,
    maxDate: Date
  ): Promise<Failure | Product[]>
}
