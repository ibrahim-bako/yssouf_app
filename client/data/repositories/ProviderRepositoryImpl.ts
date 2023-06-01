import { Provider } from "~/domain/entities/Provider"
import { ProviderRepository } from "~/domain/repositories/ProviderRepository"
import { Failure } from "~/domain/Failure"

export class ProviderRepositoryImpl implements ProviderRepository {
  items = useDirectusItems()

  async getAll(): Promise<Provider[] | Failure> {
    try {
      const response = await this.items.getItems<Provider>({
        collection: "provider",
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

  async add(provider: Provider): Promise<Failure | Provider> {
    try {
      const response = await this.items.createItems<Provider>({
        collection: "provider",
        items: [provider],
      })

      return response[0]
    } catch (err) {
      return new Failure(`mpossible de récupéré l'élément "${provider.id}"`)
    }
  }

  async remove(id: number): Promise<Failure | void> {
    try {
      await this.items.deleteItems({
        collection: "provider",
        items: [id.toString()],
      })
    } catch (err) {
      return new Failure(`mpossible de récupéré l'élément "${id}"`)
    }
  }

  async update(provider: Provider): Promise<Failure | Provider> {
    try {
      const response = await this.items.updateItem<Provider>({
        collection: "provider",
        id: provider.id!.toString(),
        item: provider,
      })

      return response
    } catch (err) {
      return new Failure(`mpossible de récupéré l'élément "${provider.id}"`)
    }
  }

  async get(id: number): Promise<Provider | Failure> {
    try {
      const response = await this.items.getItemById<Provider>({
        collection: "provider",
        id: id.toString(),
      })

      return response
    } catch (err) {
      return new Failure(`mpossible de récupéré l'élément "${id}"`)
    }
  }
}
