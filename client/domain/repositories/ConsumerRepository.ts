import { Failure } from "../Failure"
import { Consumer } from "../entities/Consumer"

export abstract class ConsumerRepository {
  abstract get(id: number): Promise<Consumer | Failure>
  abstract getAll(): Promise<Consumer[] | Failure>
  abstract add(consumer: Consumer): Promise<Consumer | Failure>
  abstract remove(id: number): Promise<void | Failure>
  abstract update(consumer: Consumer): Promise<Consumer | Failure>
}
