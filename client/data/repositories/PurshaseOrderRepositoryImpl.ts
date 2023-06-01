import { PurshaseOrder } from "~/domain/entities/PurshaseOrder"
import { PurshaseOrderRepository } from "~/domain/repositories/PurshaseOrderRepository"
import { Failure } from "~/domain/Failure"
import moment from "moment"

export class PurshaseOrderRepositoryImpl implements PurshaseOrderRepository {
  items = useDirectusItems()

  async getByProviderBetweenDatesWithProducts(
    consumerId: number,
    min: Date,
    max: Date
  ): Promise<Failure | PurshaseOrder[]> {
    try {
      const response = await this.items.getItems<PurshaseOrder>({
        collection: "purshase_order",
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
            provider: consumerId,
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

  async getBetweenDatesWithProducts(min: Date, max: Date): Promise<Failure | PurshaseOrder[]> {
    try {
      const response = await this.items.getItems<PurshaseOrder>({
        collection: "purshase_order",
        params: {
          fields: [
            "id",
            "date",
            "advence_paid",
            "provider.id",
            "provider.name",
            "provider.ifu",
            "provider.rccm",
            "provider.tel",
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

  async update(purshase_order: PurshaseOrder): Promise<Failure | PurshaseOrder> {
    try {
      const response = await this.items.updateItem<PurshaseOrder>({
        collection: "purshase_order",
        id: purshase_order.id!.toString(),
        item: purshase_order,
      })

      return response
    } catch (err) {
      return new Failure("")
    }
  }

  async getBetweenDates(min: Date, max: Date): Promise<Failure | PurshaseOrder[]> {
    try {
      const response = await this.items.getItems<PurshaseOrder>({
        collection: "purshase_order",
        params: {
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

  async get(id: number): Promise<Failure | PurshaseOrder> {
    try {
      const response = await this.items.getItemById<PurshaseOrder>({
        collection: "purshase_order",
        id: id.toString(),
      })

      return response
    } catch (err) {
      return new Failure()
    }
  }

  async filterByProvider(providerId: number): Promise<Failure | PurshaseOrder[]> {
    try {
      const response = await this.items.getItems<PurshaseOrder>({
        collection: "purshase_order",
        params: {
          filter: {
            consumer: providerId,
          },
        },
      })

      return response
    } catch (err) {
      return new Failure("")
    }
  }

  async add(purshase_order: PurshaseOrder): Promise<Failure | PurshaseOrder> {
    try {
      const response = await this.items.createItems<PurshaseOrder>({
        collection: "purshase_order",
        items: [purshase_order],
      })

      return response[0]
    } catch (err) {
      return new Failure("")
    }
  }

  async remove(id: number): Promise<Failure | void> {
    try {
      await this.items.deleteItems({
        collection: "purshase_order",
        items: [id.toString()],
      })
    } catch (err) {
      return new Failure("")
    }
  }
}
