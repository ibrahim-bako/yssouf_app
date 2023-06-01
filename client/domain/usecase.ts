import { Failure } from "./Failure"

export abstract class UseCase<Type, Params> {
  abstract execute(params: Params): Promise<Failure | Type>
}
