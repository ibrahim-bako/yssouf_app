import { ProviderRepositoryImpl } from "~/data/repositories/ProviderRepositoryImpl"
import { GetProviderUseCase } from "~/domain/usecases/GetProvider"
import { ConsumerRepositoryImpl } from "~~/data/repositories/ConsumerRepositoryImpl"
import { DailyWorkRepositoryImpl } from "~~/data/repositories/DailyWorkRepositoryImpl"
import { DeliveryNoteRepositoryImpl } from "~~/data/repositories/DeliveryNoteRepositoryImpl"
import { DeliverySlipRepositoryImpl } from "~~/data/repositories/DeliverySlipRepositoryImpl"
import { ProductRepositoryImpl } from "~~/data/repositories/ProductRepositoryImpl"
import { PurshaseOrderRepositoryImpl } from "~~/data/repositories/PurshaseOrderRepositoryImpl"
import { SellInvoiceRepositoryImpl } from "~~/data/repositories/SellInvoiceRepositoryImpl"
import { GetAllConsumersUseCase } from "~~/domain/usecases/GetAllConsumers"
import { GetAllProvidersUseCase } from "~~/domain/usecases/GetAllProviders"
import { GetOrderForProviderBetweenDatesUseCase } from "~~/domain/usecases/GetOrderForProviderBetweenDates"
import { GetProductionBetweenDatesUseCase } from "~~/domain/usecases/GetProductionBetweenDates"
import { GetPurshaseOrderBetweenDatesUseCase } from "~~/domain/usecases/GetPurshaseOrderBetweenDates"
import { GetPurshaseOrdersProductsBetweenDates } from "~~/domain/usecases/GetPurshaseOrdersProductsBetweenDates"
import { GetSellInvoiceBetweenDatesUseCase } from "~~/domain/usecases/GetSellInvoiceBetweenDates"
import { GetSellInvoicesProductsBetweenDates } from "~~/domain/usecases/GetSellInvoicesProductsBetweenDates"
import { GetSellsForConsumerBetweenDatesUseCase } from "~~/domain/usecases/GetSellsForConsumerBetweenDates"

const providerRepository = new ProviderRepositoryImpl()
const sellInvoiceRepository = new SellInvoiceRepositoryImpl()
const consumerRepository = new ConsumerRepositoryImpl()
const productRepository = new ProductRepositoryImpl()
const deliveryNoteRepository = new DeliveryNoteRepositoryImpl()
const deliverySlipRepository = new DeliverySlipRepositoryImpl()
const purshaseOrderRepository = new PurshaseOrderRepositoryImpl()
const dailyWorkRepository = new DailyWorkRepositoryImpl()

export const getProviderUseCase = new GetProviderUseCase(providerRepository)
export const getSellInvoiceBetweenDatesUseCase = new GetSellInvoiceBetweenDatesUseCase(
  sellInvoiceRepository,
  productRepository
)
export const getPurshaseOrderBetweenDatesUseCase = new GetPurshaseOrderBetweenDatesUseCase(
  purshaseOrderRepository,
  productRepository
)

export const getSellsForConsumerBetweenDatesUsecase = new GetSellsForConsumerBetweenDatesUseCase(
  sellInvoiceRepository,
  productRepository
)

export const getOrderForProviderBetweenDatesUseCase = new GetOrderForProviderBetweenDatesUseCase(
  purshaseOrderRepository,
  productRepository
)

export const getPurshaseOrdersProductsBetweenDates = new GetPurshaseOrdersProductsBetweenDates(
  purshaseOrderRepository
)

export const getSellInvoicesProductsBetweenDates = new GetSellInvoicesProductsBetweenDates(
  sellInvoiceRepository
)
export const getProductionBetweenDatesUseCase = new GetProductionBetweenDatesUseCase(
  dailyWorkRepository
)

export const getAllConsumersUseCase = new GetAllConsumersUseCase(consumerRepository)

export const getAllProvidersUseCase = new GetAllProvidersUseCase(providerRepository)
