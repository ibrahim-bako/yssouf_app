import { min } from "moment"
import { Failure } from "../Failure"
import { SellInvoice } from "../entities/SellInvoice"
import { SellInvoiceRepository } from "../repositories/SellInvoiceRepository"
import { UseCase } from "../usecase"
import { ProductRepository } from "../repositories/ProductRepository"
import { Product } from "../entities/Product"

type Params = {
  minDate: Date
  maxDate: Date
}

type Response = {
  sellInvoices: SellInvoice[]
  total_price: number
}

export class GetSellInvoiceBetweenDatesUseCase implements UseCase<Response, Params> {
  sellInvoiceRepository: SellInvoiceRepository
  productRepository: ProductRepository

  constructor(sellInvoiceRepository: SellInvoiceRepository, productRepository: ProductRepository) {
    this.sellInvoiceRepository = sellInvoiceRepository
    this.productRepository = productRepository
  }

  async execute({ minDate, maxDate }: Params): Promise<Response | Failure> {
    try {
      const sellInvoices = await this.sellInvoiceRepository.getBetweenDatesWithProducts(
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
        total_price: total,
      } as Response
    } catch (err) {
      return new Failure()
    }
  }
}
