import { Failure } from "../Failure"
import { Provider } from "../entities/Provider"
import { ProviderRepository } from "../repositories/ProviderRepository"
import { UseCase } from "../usecase"

export class GetProviderUseCase implements UseCase<Provider, number> {
  providerRepository: ProviderRepository

  constructor(providerRepository: ProviderRepository) {
    this.providerRepository = providerRepository
  }

  async execute(id: number): Promise<Provider | Failure> {
    return await this.providerRepository.get(id)
  }
}
