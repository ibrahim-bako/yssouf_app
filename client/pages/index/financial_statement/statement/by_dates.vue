<script setup lang="ts">
import { PurshaseOrder } from "~/domain/entities/PurshaseOrder"
import { SellInvoice } from "~/domain/entities/SellInvoice"
import { Failure } from "~/domain/Failure"
import moment from "moment"

definePageMeta({
  middleware: ["auth"],
})

const $q = useQuasar()

type State = {
  minDate: Date
  maxDate: Date
  sellInvoices: SellInvoice[]
  sellTotalPrice: number
  purshaseOrders: PurshaseOrder[]
  orderTotalPrice: number
}

const state = ref({
  minDate: moment().startOf("day").toDate(),
  maxDate: moment().endOf("day").toDate(),
  sellInvoices: [],
  purshaseOrders: [],
  sellTotalPrice: 0,
  orderTotalPrice: 0,
} as State)

const minDate = computed({
  get() {
    return useDateFormat(state.value.minDate, "YYYY-MM-DD").value
  },
  set(value) {
    state.value.minDate = moment(value).startOf("day").toDate()
  },
})

const maxDate = computed({
  get() {
    return useDateFormat(state.value.maxDate, "YYYY-MM-DD").value
  },
  set(value) {
    state.value.maxDate = moment(value).endOf("day").toDate()
  },
})

watch(
  [() => state.value.minDate, () => state.value.maxDate],
  async () => {
    try {
      const response1 = await getSellInvoiceBetweenDatesUseCase.execute({
        minDate: state.value.minDate,
        maxDate: state.value.maxDate,
      })

      if (response1 instanceof Failure) throw new Failure()
      console.log("response1", response1)

      const response2 = await getPurshaseOrderBetweenDatesUseCase.execute({
        minDate: state.value.minDate,
        maxDate: state.value.maxDate,
      })

      if (response2 instanceof Failure) throw new Failure()
      console.log("response2", response2)

      state.value.sellInvoices = response1.sellInvoices
      state.value.sellTotalPrice = response1.total_price

      state.value.purshaseOrders = response2.purshaseOrders
      state.value.orderTotalPrice = response2.total_price
    } catch (err) {
      return $q.notify({
        color: "red",
        message: "erreur de chanrgement des ressources. Recharger la page.",
      })
    }
  },
  { immediate: true }
)

import { TDocumentDefinitions } from "pdfmake/interfaces"
import "pdfmake/build/vfs_fonts"
import * as pdfMake from "pdfmake/build/pdfmake"
import * as pdfFonts from "pdfmake/build/vfs_fonts"

// @ts-ignore
pdfMake.vfs = pdfFonts.pdfMake.vfs

const doc = computed<TDocumentDefinitions>(() => {
  const doc: TDocumentDefinitions = {
    content: [
      { text: "Etat Financier", style: "title", margin: [0, 0, 0, 20], alignment: "center" },
      {
        text: `Du ${useDateFormat(state.value.minDate, "DD/MM/YYYY").value} au ${
          useDateFormat(state.value.maxDate, "DD/MM/YYYY").value
        }`,
        alignment: "right",
      },
      { text: " ", margin: [0, 0] },
      { text: "Etat des achats", style: "title2" },
      {
        margin: [5, 10],
        table: {
          widths: [70, 120, 120, 120],
          body: [
            [
              { text: "N°Facture", style: "tableHeader" },
              { text: "Date", style: "tableHeader" },
              { text: "Fournisseur", style: "tableHeader" },
              { text: "Prix", style: "tableHeader" },
            ],
            ...state.value.purshaseOrders
              .sort((order1, order2) => {
                // @ts-ignore
                let fa = order1.provider.name.toLowerCase()
                // @ts-ignore
                let fb = order2.provider.name.toLowerCase()

                if (fa < fb) {
                  return -1
                }
                if (fa > fb) {
                  return 1
                }
                return 0
              })
              .map((order) => {
                let total = 0

                order.products.map((product) => {
                  if (typeof product !== "number") {
                    total += product.quantity * product.unit_price
                  }
                })
                return [
                  padInvoiceNumber(order.id!).toString(),
                  useDateFormat(order.date, "DD/MM/YYYY").value,
                  // @ts-ignore
                  order.provider.name.toString(),
                  formatNumberToDisplay(total),
                ]
              }),
            [
              { text: "Total", colSpan: 3, style: "tableHeader" },
              " ",
              " ",
              { text: formatNumberToDisplay(state.value.orderTotalPrice), style: "tableHeader" },
            ],
          ],
        },
      },
      { text: " ", margin: [0, 0] },
      { text: "Etat des ventes", style: "title2" },
      {
        margin: [5, 10],
        table: {
          widths: [70, 120, 120, 120],
          body: [
            [
              { text: "N°Facture", style: "tableHeader" },
              { text: "Date", style: "tableHeader" },
              { text: "Client", style: "tableHeader" },
              { text: "Prix", style: "tableHeader" },
            ],
            ...state.value.sellInvoices
              .sort((invoice1, invoice2) => {
                // @ts-ignore
                let fa = invoice1.consumer.name.toLowerCase()
                // @ts-ignore
                let fb = invoice2.consumer.name.toLowerCase()

                if (fa < fb) {
                  return -1
                }
                if (fa > fb) {
                  return 1
                }
                return 0
              })
              .map((invoice) => {
                let total = 0

                invoice.products.map((product) => {
                  if (typeof product !== "number") {
                    total += product.quantity * product.unit_price
                  }
                })
                return [
                  padInvoiceNumber(invoice.id!).toString(),
                  useDateFormat(invoice.date, "DD/MM/YYYY").value,
                  // @ts-ignore
                  invoice.consumer.name.toString(),
                  formatNumberToDisplay(total),
                ]
              }),
            [
              { text: "Total", colSpan: 3, style: "tableHeader" },
              " ",
              " ",
              { text: formatNumberToDisplay(state.value.sellTotalPrice), style: "tableHeader" },
            ],
          ],
        },
      },
    ],
    styles: {
      title: {
        bold: true,
        fontSize: 28,
      },
      title2: {
        bold: true,
        fontSize: 18,
      },
      tableHeader: {
        bold: true,
        fontSize: 13,
      },
    },
  }

  return doc
})

const pdfUrl = ref("")
watch(
  state,
  () => {
    pdfMake.createPdf(doc.value).getDataUrl((url) => (pdfUrl.value = url))
  },
  { deep: true }
)
</script>

<template>
  <div class="flex justify-end space-x-5">
    <q-input type="date" outlined dense v-model="minDate" label="min date" />
    <q-input type="date" outlined dense v-model="maxDate" label="max date" />
  </div>
  <div class="p-4">
    <embed :src="pdfUrl" width="800" height="1200" type="application/pdf" />
  </div>
  <!-- {{ state }} -->
</template>
