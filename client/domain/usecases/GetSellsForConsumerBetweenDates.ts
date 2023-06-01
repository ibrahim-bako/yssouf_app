import { Failure } from "../Failure"
import { SellInvoice } from "../entities/SellInvoice"
import { ProductRepository } from "../repositories/ProductRepository"
import { SellInvoiceRepository } from "../repositories/SellInvoiceRepository"
import { UseCase } from "../usecase"

type Params = {
  consumerId: number
  minDate: Date
  maxDate: Date
}

type Response = {
  sellInvoices: SellInvoice[]
  totalPrice: number
}

export class GetSellsForConsumerBetweenDatesUseCase implements UseCase<Response, Params> {
  sellInvoiceRepository: SellInvoiceRepository
  productRepository: ProductRepository

  constructor(sellInvoiceRepository: SellInvoiceRepository, productRepository: ProductRepository) {
    this.sellInvoiceRepository = sellInvoiceRepository
    this.productRepository = productRepository
  }

  async execute({ consumerId, maxDate, minDate }: Params): Promise<Response | Failure> {
    try {
      const sellInvoices = await this.sellInvoiceRepository.getByConsumerBetweenDatesWithProducts(
        consumerId,
        minDate,
        maxDate
      )

      if (sellInvoices instanceof Failure) return new Failure()

      const products = sellInvoices.map((elem) => {
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
        sellInvoices,
        totalPrice: total,
      } as Response
    } catch (err) {
      return new Failure()
    }
  }
}
