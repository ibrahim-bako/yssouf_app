import { DeliverySlip } from "~/domain/entities/DeliverySlip"
import { DeliverySlipRepository } from "~/domain/repositories/DeliverySlipRepository"
import { Failure } from "~/domain/Failure"

export class DeliverySlipRepositoryImpl implements DeliverySlipRepository {
  items = useDirectusItems()

  async update(delivery_slip: DeliverySlip): Promise<Failure | DeliverySlip> {
    try {
      const response = await this.items.updateItem<DeliverySlip>({
        collection: "delivery_slip",
        id: delivery_slip.id!.toString(),
        item: delivery_slip,
      })

      return response
    } catch (err) {
      return new Failure("")
    }
  }

  async getBetweenDates(min: Date, max: Date): Promise<Failure | DeliverySlip[]> {
    try {
      const response = await this.items.getItems<DeliverySlip>({
        collection: "delivery_slip",
        params: {
          filter: {
            date:
              min && max
                ? {
                    _between: [formatDateNoneToIosString(min), formatDateNoneToIosString(max)],
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

  async get(id: number): Promise<Failure | DeliverySlip> {
    try {
      const response = await this.items.getItemById<DeliverySlip>({
        collection: "delivery_slip",
        id: id.toString(),
      })

      return response
    } catch (err) {
      return new Failure()
    }
  }

  async filterByProvider(providerId: number): Promise<Failure | DeliverySlip[]> {
    try {
      const response = await this.items.getItems<DeliverySlip>({
        collection: "delivery_slip",
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

  async add(delivery_slip: DeliverySlip): Promise<Failure | DeliverySlip> {
    try {
      const response = await this.items.createItems<DeliverySlip>({
        collection: "delivery_slip",
        items: [delivery_slip],
      })

      return response[0]
    } catch (err) {
      return new Failure("")
    }
  }

  async remove(id: number): Promise<Failure | void> {
    try {
      await this.items.deleteItems({
        collection: "delivery_slip",
        items: [id.toString()],
      })
    } catch (err) {
      return new Failure("")
    }
  }
}
