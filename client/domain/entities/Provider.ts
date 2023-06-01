import { DeliverySlip } from "./DeliverySlip"
import { PurshaseOrder } from "./PurshaseOrder"

export interface Provider {
  id?: number
  name: string
  ifu: string
  rccm: string
  tel: string
  delivery_slip: number[] | DeliverySlip[]
  purshase_order: number[] | PurshaseOrder[]
}
