import { ProductRepository } from "~/domain/repositories/ProductRepository"
import { Failure } from "~/domain/Failure"
import { Product } from "~/domain/entities/Product"
import moment from "moment"

export class ProductRepositoryImpl implements ProductRepository {
  items = useDirectusItems()

  async getBetweenDates(minDate: Date, maxDate: Date): Promise<Failure | Product[]> {
    try {
      const response = await this.items.getItems<Product>({
        collection: "product",
        params: {
          filter: {
            date:
              minDate && maxDate
                ? {
                    _between: [
                      moment(minDate.toString()).startOf("day"),
                      moment(maxDate.toString()).endOf("day"),
                    ],
                  }
                : undefined,
          },
        },
      })

      return response
    } catch (err) {
      return new Failure()
    }
  }

  async get(id: number): Promise<Failure | Product> {
    try {
      const response = await this.items.getItemById<Product>({
        collection: "product",
        id: id.toString(),
      })

      return response
    } catch (err) {
      return new Failure()
    }
  }
  async remove(id: number): Promise<void | Failure> {
    try {
      const response = await this.items.deleteItems({
        collection: "product",
        items: [id.toString()],
      })
    } catch (err) {
      return new Failure()
    }
  }
  async add(product: Product): Promise<Failure | Product> {
    try {
      const response = await this.items.createItems<Product>({
        collection: "product",
        items: [product],
      })

      return response[0]
    } catch (err) {
      return new Failure()
    }
  }
  async addMany(products: Product[]): Promise<Failure | Product[]> {
    try {
      const response = await this.items.createItems<Product>({
        collection: "product",
        items: products,
      })

      return response
    } catch (err) {
      return new Failure()
    }
  }
  async getByDeliveryNote(deliveryNoteId: number): Promise<Failure | Product[]> {
    try {
      const response = await this.items.getItems<Product>({
        collection: "product",
        params: {
          filter: {
            delivery_note: deliveryNoteId,
          },
        },
      })

      return response
    } catch (err) {
      return new Failure()
    }
  }
  async getBySellInvoice(sellInvoiceId: number): Promise<Failure | Product[]> {
    try {
      const response = await this.items.getItems<Product>({
        collection: "product",
        params: {
          filter: {
            sell_invoice: sellInvoiceId,
          },
        },
      })

      return response
    } catch (err) {
      return new Failure()
    }
  }
  async getBySellInvoiceBetweenDates(minDate: Date, maxDate: Date): Promise<Failure | Product[]> {
    try {
      const response = await this.items.getItems<Product>({
        collection: "product",
        params: {
          filter: {
            sell_invoice: { _nnull: undefined },
            date:
              minDate && maxDate
                ? {
                    _between: [
                      formatDateNoneToIosString(minDate),
                      formatDateNoneToIosString(maxDate),
                    ],
                  }
                : undefined,
          },
        },
      })

      return response
    } catch (err) {
      return new Failure()
    }
  }
  async getByDeliverySlip(deliverySlipId: number): Promise<Failure | Product[]> {
    try {
      const response = await this.items.getItems<Product>({
        collection: "product",
        params: {
          filter: {
            delivery_slip: deliverySlipId,
          },
        },
      })

      return response
    } catch (err) {
      return new Failure()
    }
  }
  async getByPurshadeOrder(purshadeOrderId: number): Promise<Failure | Product[]> {
    try {
      const response = await this.items.getItems<Product>({
        collection: "product",
        params: {
          filter: {
            purshase_order: purshadeOrderId,
          },
        },
      })

      return response
    } catch (err) {
      return new Failure()
    }
  }
  async getByPurshadeOrderBetweenDates(minDate: Date, maxDate: Date): Promise<Failure | Product[]> {
    try {
      const response = await this.items.getItems<Product>({
        collection: "product",
        params: {
          filter: {
            purshase_order: { _nnull: undefined },
            date:
              minDate && maxDate
                ? {
                    _between: [
                      formatDateNoneToIosString(minDate),
                      formatDateNoneToIosString(maxDate),
                    ],
                  }
                : undefined,
          },
        },
      })

      return response
    } catch (err) {
      return new Failure()
    }
  }
}
