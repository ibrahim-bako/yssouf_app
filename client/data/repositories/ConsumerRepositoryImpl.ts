import { ConsumerRepository } from "~/domain/repositories/ConsumerRepository"
import { Failure } from "~~/domain/Failure"
import { Consumer } from "~~/domain/entities/Consumer"

const CONSUMER_FIELDS = ["id", "name", "ifu", "rccm", "tel", "delivery_note", "sell_invoice"]

export class ConsumerRepositoryImpl implements ConsumerRepository {
  items = useDirectusItems()

  async getAll(): Promise<Failure | Consumer[]> {
    try {
      const response = await this.items.getItems<Consumer>({
        collection: "consumer",
        params: {
          fields: ["id", "name", "ifu", "rccm", "tel"],
          limit: -1,
        },
      })

      return response
    } catch (err) {
      return new Failure()
    }
  }

  async add(consumer: Consumer): Promise<Failure | Consumer> {
    try {
      const response = await this.items.createItems<Consumer>({
        collection: "consumer",
        items: [consumer],
      })

      return response[0]
    } catch (err) {
      return new Failure(`mpossible de récupéré l'élément "${consumer.id}"`)
    }
  }

  async get(id: number): Promise<Failure | Consumer> {
    try {
      const response = await this.items.getItemById<Consumer>({
        collection: "consumer",
        id: id.toString(),
      })

      return response
    } catch (err) {
      return new Failure(`mpossible de récupéré l'élément "${id}"`)
    }
  }

  async remove(id: number): Promise<void | Failure> {
    try {
      const response = await this.items.deleteItems({
        collection: "consumer",
        items: [id.toString()],
      })

      return response
    } catch (err) {
      return new Failure(`mpossible de récupéré l'élément "${id}"`)
    }
  }

  async update(consumer: Consumer): Promise<Failure | Consumer> {
    try {
      const response = await this.items.updateItem<Consumer>({
        collection: "consumer",
        id: consumer.id?.toString()!,
        item: consumer,
      })

      return response
    } catch (err) {
      return new Failure(`mpossible de récupéré l'élément "${consumer.id}"`)
    }
  }
}
