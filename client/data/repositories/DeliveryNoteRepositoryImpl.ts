import { DeliveryNote } from "~/domain/entities/DeliveryNote"
import { DeliveryNoteRepository } from "~/domain/repositories/DeliveryNoteRepository"
import { Failure } from "~/domain/Failure"

export class DeliveryNoteRepositoryImpl implements DeliveryNoteRepository {
  items = useDirectusItems()

  async update(delivery_note: DeliveryNote): Promise<Failure | DeliveryNote> {
    try {
      const response = await this.items.updateItem<DeliveryNote>({
        collection: "delivery_note",
        id: delivery_note.id!.toString(),
        item: delivery_note,
      })

      return response
    } catch (err) {
      return new Failure("")
    }
  }

  async getBetweenDates(min: Date, max: Date): Promise<Failure | DeliveryNote[]> {
    try {
      const response = await this.items.getItems<DeliveryNote>({
        collection: "delivery_note",
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

  async get(id: number): Promise<Failure | DeliveryNote> {
    try {
      const response = await this.items.getItemById<DeliveryNote>({
        collection: "delivery_note",
        id: id.toString(),
      })

      return response
    } catch (err) {
      return new Failure()
    }
  }

  async filterByConsumer(consumerId: number): Promise<Failure | DeliveryNote[]> {
    try {
      const response = await this.items.getItems<DeliveryNote>({
        collection: "delivery_note",
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

  async add(delivery_note: DeliveryNote): Promise<Failure | DeliveryNote> {
    try {
      const response = await this.items.createItems<DeliveryNote>({
        collection: "delivery_note",
        items: [delivery_note],
      })

      return response[0]
    } catch (err) {
      return new Failure("")
    }
  }

  async remove(id: number): Promise<Failure | void> {
    try {
      await this.items.deleteItems({
        collection: "delivery_note",
        items: [id.toString()],
      })
    } catch (err) {
      return new Failure("")
    }
  }
}
