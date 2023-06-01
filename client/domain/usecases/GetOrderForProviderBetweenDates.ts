import { Failure } from "../Failure"
import { PurshaseOrder } from "../entities/PurshaseOrder"
import { ProductRepository } from "../repositories/ProductRepository"
import { PurshaseOrderRepository } from "../repositories/PurshaseOrderRepository"
import { UseCase } from "../usecase"

type Params = {
  providerId: number
  minDate: Date
  maxDate: Date
}

type Response = {
  purshaseOrders: PurshaseOrder[]
  totalPrice: number
}

export class GetOrderForProviderBetweenDatesUseCase implements UseCase<Response, Params> {
  purshaseOrderRepository: PurshaseOrderRepository
  productRepository: ProductRepository

  constructor(
    purshaseOrderRepository: PurshaseOrderRepository,
    productRepository: ProductRepository
  ) {
    this.purshaseOrderRepository = purshaseOrderRepository
    this.productRepository = productRepository
  }

  async execute({ providerId, maxDate, minDate }: Params): Promise<Response | Failure> {
    try {
      const purshaseOrders =
        await this.purshaseOrderRepository.getByProviderBetweenDatesWithProducts(
          providerId,
          minDate,
          maxDate
        )

      if (purshaseOrders instanceof Failure) return new Failure()

      const products = purshaseOrders.map((elem) => {
        return elem.products.map((el) => {
          if (typeof el === "number") return 0
          return el.quantity * el.unit_price
        })
      })

      let total = 0

      for (const product of products) {
        let sum = product.reduce((a, b) => a + b, 0)
        total += sum
      }

      return {
        purshaseOrders,
        totalPrice: total,
      } as Response
    } catch (err) {
      return new Failure()
    }
  }
}
