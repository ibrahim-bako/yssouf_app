import moment from "moment"
import { Failure } from "~~/domain/Failure"
import { DailyWork } from "~~/domain/entities/DailyWork"
import { DailyWorkRepository } from "~~/domain/repositories/DailyWorkRepository"

export class DailyWorkRepositoryImpl implements DailyWorkRepository {
  items = useDirectusItems()

  async get(id: number): Promise<any> {
    try {
      const response = await this.items.getItemById<DailyWork>({
        collection: "daily_work",
        id: id.toString(),
      })

      return response
    } catch (err) {
      return new Failure()
    }
  }

  async getAll(): Promise<Failure | DailyWork[]> {
    try {
      const response = await this.items.getItems<DailyWork>({
        collection: "daily_work",
        params: {
          limit: -1,
        },
      })

      return response
    } catch (err) {
      return new Failure()
    }
  }

  async add(dailyWork: DailyWork): Promise<DailyWork | Failure> {
    try {
      const response = await this.items.createItems<DailyWork>({
        collection: "daily_work",
        items: [dailyWork],
      })

      return response[0]
    } catch (err) {
      return new Failure("")
    }
  }

  async remove(id: number): Promise<void | Failure> {
    try {
      await this.items.deleteItems({
        collection: "daily_work",
        items: [id.toString()],
      })
    } catch (err) {
      return new Failure("")
    }
  }

  async update(dailyWork: DailyWork): Promise<any> {
    try {
      const response = await this.items.updateItem<DailyWork>({
        collection: "daily_work",
        id: dailyWork.id!.toString(),
        item: dailyWork,
      })

      return response
    } catch (err) {
      return new Failure("")
    }
  }

  async getBetweenDates(min: Date, max: Date): Promise<Failure | DailyWork[]> {
    try {
      const response = await this.items.getItems<DailyWork>({
        collection: "daily_work",
        params: {
          filter: {
            date:
              min && max
                ? {
                    _between: [
                      moment(min.toISOString()).startOf("day").toISOString(),
                      moment(max.toISOString()).endOf("day").toISOString(),
                    ],
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
}
