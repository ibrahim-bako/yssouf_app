import { Consumer } from "./Consumer"
import { Product } from "./Product"

export interface DeliveryNote {
  id?: number
  consumer: number | Consumer
  date: Date
  products: number[] | Product[]
}
