import { Failure } from "../Failure"
import { DailyWork } from "../entities/DailyWork"

export abstract class DailyWorkRepository {
  abstract get(id: number): Promise<DailyWork | Failure>
  abstract getAll(): Promise<DailyWork[] | Failure>
  abstract add(dailyWork: DailyWork): Promise<DailyWork | Failure>
  abstract remove(id: number): Promise<void | Failure>
  abstract update(dailyWork: DailyWork): Promise<DailyWork | Failure>
  abstract getBetweenDates(min: Date, max: Date): Promise<Failure | DailyWork[]>
}
