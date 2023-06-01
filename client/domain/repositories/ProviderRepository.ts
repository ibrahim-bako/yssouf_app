import { Failure } from "../Failure"
import { Provider } from "../entities/Provider"

export abstract class ProviderRepository {
  abstract get(id: number): Promise<Provider | Failure>
  abstract getAll(): Promise<Provider[] | Failure>
  abstract add(provider: Provider): Promise<Provider | Failure>
  abstract remove(id: number): Promise<void | Failure>
  abstract update(provider: Provider): Promise<Provider | Failure>
}
