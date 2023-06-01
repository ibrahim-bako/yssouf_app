import { Failure } from "../Failure"
import { DailyWork } from "../entities/DailyWork"
import { DailyWorkRepository } from "../repositories/DailyWorkRepository"
import { UseCase } from "../usecase"

type Params = {
  minDate: Date
  maxDate: Date
}

type Production = {
  totalUsed: number
  totalSorted: number
  totalPeeled: number
  totalDried: number
}

export class GetProductionBetweenDatesUseCase implements UseCase<Production, Params> {
  dailyWorkRepository: DailyWorkRepository

  constructor(dailyWorkRepository: DailyWorkRepository) {
    this.dailyWorkRepository = dailyWorkRepository
  }

  async execute({ maxDate, minDate }: Params): Promise<Production | Failure> {
    const dailyWorks = await this.dailyWorkRepository.getBetweenDates(minDate, maxDate)

    if (dailyWorks instanceof Failure) return new Failure()
    console.log(dailyWorks)

    let result: Production = { totalDried: 0, totalPeeled: 0, totalSorted: 0, totalUsed: 0 }

    dailyWorks.map((dailyWork) => {
      result.totalUsed += dailyWork.used_quantity
      result.totalSorted += dailyWork.sorted_quantity
      result.totalPeeled += dailyWork.peeled_quantity
      result.totalDried += dailyWork.dried_quantity
    })

    return result
  }
}
