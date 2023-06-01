import { Failure } from "../Failure"
import { Provider } from "../entities/Provider"
import { ProviderRepository } from "../repositories/ProviderRepository"
import { UseCase } from "../usecase"

export class GetAllProvidersUseCase implements UseCase<Provider[], void> {
  providerRepository: ProviderRepository

  constructor(providerRepository: ProviderRepository) {
    this.providerRepository = providerRepository
  }

  async execute(params: void): Promise<Provider[] | Failure> {
    return await this.providerRepository.getAll()
  }
}
