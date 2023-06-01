import { DeliveryNote } from "./DeliveryNote"
import { SellInvoice } from "./SellInvoice"

export interface Consumer {
  id?: number
  name: string
  ifu: string
  rccm: string
  tel: string
  delivery_note: number[] | DeliveryNote[]
  sell_invoice: number[] | SellInvoice[]
}
