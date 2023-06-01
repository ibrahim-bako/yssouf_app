import { Product } from "./Product"
import { Provider } from "./Provider"

export interface DeliverySlip {
  id?: number
  date: Date
  provider: number | Provider
  products: number[] | Product[]
}
