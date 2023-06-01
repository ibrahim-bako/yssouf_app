import { Product } from "./Product"
import { Provider } from "./Provider"

export interface PurshaseOrder {
  id?: number
  provider: number | Provider
  date: Date
  advence_paid: number
  products: number[] | Product[]
}
