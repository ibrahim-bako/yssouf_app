import { Failure } from "../Failure"
import { Product } from "../entities/Product"
import { SellInvoiceRepository } from "../repositories/SellInvoiceRepository"
import { UseCase } from "../usecase"

type Params = {
  minDate: Date
  maxDate: Date
}

type Response = {
  name: string
  weight: number
}

export class GetSellInvoicesProductsBetweenDates implements UseCase<Response[], Params> {
  sellInvoiceRepository: SellInvoiceRepository

  constructor(sellInvoiceRepository: SellInvoiceRepository) {
    this.sellInvoiceRepository = sellInvoiceRepository
  }

  async execute({ minDate, maxDate }: Params): Promise<Response[] | Failure> {
    try {
      const response = await this.sellInvoiceRepository.getBetweenDatesWithProducts(
        minDate,
        maxDate
      )

      if (response instanceof Failure) return new Failure()

      const products: Product[] = []

      for (const order of response) {
        for (const product of order.products) {
          products.push(product as Product)
        }
      }

      let names: string[] = []
      for (const product of products) {
        names.push(product.designation)
      }

      const designations = [...new Set(names)]
      const result: Response[] = []

      for (const des of designations) {
        let totalWeight = 0
        for (const product of products) {
          if (product.designation === des) {
            totalWeight += product.weigth
          }
        }
        result.push({ name: des, weight: totalWeight })
      }

      return result
    } catch (err) {
      return new Failure()
    }
  }
}
