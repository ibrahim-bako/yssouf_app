import { Failure } from "../Failure"
import { Consumer } from "../entities/Consumer"
import { ConsumerRepository } from "../repositories/ConsumerRepository"
import { UseCase } from "../usecase"

export class GetAllConsumersUseCase implements UseCase<Consumer[], void> {
  consumerRepository: ConsumerRepository

  constructor(consumerRepository: ConsumerRepository) {
    this.consumerRepository = consumerRepository
  }

  async execute(params: void): Promise<Consumer[] | Failure> {
    return await this.consumerRepository.getAll()
  }
}
