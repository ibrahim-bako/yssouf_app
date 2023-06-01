import { Consumer } from "./Consumer"
import { Product } from "./Product"

export interface SellInvoice {
  id?: number
  consumer: number | Consumer
  date: Date
  advence_paid: number
  products: number[] | Product[]
}
