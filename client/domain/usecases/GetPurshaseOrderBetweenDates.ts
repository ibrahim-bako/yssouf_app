import { Failure } from "../Failure"
import { PurshaseOrder } from "../entities/PurshaseOrder"
import { PurshaseOrderRepository } from "../repositories/PurshaseOrderRepository"
import { UseCase } from "../usecase"
import { ProductRepository } from "../repositories/ProductRepository"
import { Product } from "../entities/Product"

type Params = {
  minDate: Date
  maxDate: Date
}

type Response = {
  purshaseOrders: PurshaseOrder[]
  total_price: number
}

export class GetPurshaseOrderBetweenDatesUseCase implements UseCase<Response, Params> {
  purshaseOrderRepository: PurshaseOrderRepository
  productRepository: ProductRepository

  constructor(
    purshaseOrderRepository: PurshaseOrderRepository,
    productRepository: ProductRepository
  ) {
    this.purshaseOrderRepository = purshaseOrderRepository
    this.productRepository = productRepository
  }

  async execute({ minDate, maxDate }: Params): Promise<Response | Failure> {
    try {
      const purshaseOrders = await this.purshaseOrderRepository.getBetweenDatesWithProducts(
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
        total_price: total,
      } as Response
    } catch (err) {
      return new Failure()
    }
  }
}
