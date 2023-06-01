import { SellInvoice } from "~/domain/entities/SellInvoice"
import { SellInvoiceRepository } from "~/domain/repositories/SellInvoiceRepository"
import { Failure } from "~/domain/Failure"
import moment from "moment"

export class SellInvoiceRepositoryImpl implements SellInvoiceRepository {
  items = useDirectusItems()

  async getByConsumerBetweenDatesWithProducts(
    consumerId: number,
    min: Date,
    max: Date
  ): Promise<Failure | SellInvoice[]> {
    try {
      const response = await this.items.getItems<SellInvoice>({
        collection: "sell_invoice",
        params: {
          fields: [
            "id",
            "date",
            "advence_paid",
            "products.id",
            "products.designation",
            "products.type",
            "products.quantity",
            "products.unit_price",
            "products.weigth",
          ],
          filter: {
            consumer: consumerId,
            date:
              min && max
                ? {
                    _between: [
                      moment(min.toISOString()).startOf("day").toISOString(),
                      moment(max.toISOString()).endOf("day").toISOString(),
                    ],
                  }
                : undefined,
          },
        },
      })

      return response
    } catch (err) {
      return new Failure("")
    }
  }

  async getBetweenDatesWithProducts(min: Date, max: Date): Promise<Failure | SellInvoice[]> {
    try {
      const response = await this.items.getItems<SellInvoice>({
        collection: "sell_invoice",
        params: {
          fields: [
            "id",
            "date",
            "advence_paid",
            "consumer.id",
            "consumer.name",
            "consumer.ifu",
            "consumer.rccm",
            "consumer.tel",
            "products.id",
            "products.designation",
            "products.type",
            "products.quantity",
            "products.unit_price",
            "products.weigth",
          ],
          filter: {
            date:
              min && max
                ? {
                    _between: [
                      moment(min.toISOString()).startOf("day").toISOString(),
                      moment(max.toISOString()).endOf("day").toISOString(),
                    ],
                  }
                : undefined,
          },
        },
      })

      return response
    } catch (err) {
      return new Failure("")
    }
  }

  async update(sell_invoice: SellInvoice): Promise<Failure | SellInvoice> {
    try {
      const response = await this.items.updateItem<SellInvoice>({
        collection: "sell_invoice",
        id: sell_invoice.id!.toString(),
        item: sell_invoice,
      })

      return response
    } catch (err) {
      return new Failure("")
    }
  }

  async getBetweenDates(min: Date, max: Date): Promise<Failure | SellInvoice[]> {
    try {
      const response = await this.items.getItems<SellInvoice>({
        collection: "sell_invoice",
        params: {
          filter: {
            date:
              min && max
                ? {
                    _between: [
                      moment(min.toISOString()).startOf("day").toISOString(),
                      moment(max.toISOString()).startOf("day").toISOString(),
                    ],
                  }
                : undefined,
          },
        },
      })

      return response
    } catch (err) {
      return new Failure("")
    }
  }

  async get(id: number): Promise<Failure | SellInvoice> {
    try {
      const response = await this.items.getItemById<SellInvoice>({
        collection: "sell_invoice",
        id: id.toString(),
      })

      return response
    } catch (err) {
      return new Failure()
    }
  }

  async filterByConsumer(consumerId: number): Promise<Failure | SellInvoice[]> {
    try {
      const response = await this.items.getItems<SellInvoice>({
        collection: "sell_invoice",
        params: {
          filter: {
            consumer: consumerId,
          },
        },
      })

      return response
    } catch (err) {
      return new Failure("")
    }
  }

  async add(sell_invoice: SellInvoice): Promise<Failure | SellInvoice> {
    try {
      const response = await this.items.createItems<SellInvoice>({
        collection: "sell_invoice",
        items: [sell_invoice],
      })

      return response[0]
    } catch (err) {
      return new Failure("")
    }
  }

  async remove(id: number): Promise<Failure | void> {
    try {
      await this.items.deleteItems({
        collection: "sell_invoice",
        items: [id.toString()],
      })
    } catch (err) {
      return new Failure("")
    }
  }
}
