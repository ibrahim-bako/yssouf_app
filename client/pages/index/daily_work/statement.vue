<script setup lang="ts">
import moment from "moment"
import { Failure } from "~~/domain/Failure"

definePageMeta({
  middleware: ["auth"],
})

type State = {
  minDate: Date
  maxDate: Date
  production: Production
}

type Production = {
  totalUsed: number
  totalSorted: number
  totalPeeled: number
  totalDried: number
}

const state = ref({
  minDate: moment().startOf("month").toDate(),
  maxDate: moment().endOf("month").toDate(),
  production: { totalDried: 0, totalPeeled: 0, totalSorted: 0, totalUsed: 0 },
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
    console.log("change")
    try {
      const response = await getProductionBetweenDatesUseCase.execute({
        minDate: state.value.minDate,
        maxDate: state.value.maxDate,
      })

      if (response instanceof Failure) throw new Failure()
      console.log("response1", response)

      state.value.production = response
    } catch (err) {
      console.log(err)
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
      { text: "Etat de Production", style: "title", margin: [0, 0, 0, 20], alignment: "center" },
      {
        text: `Du ${useDateFormat(state.value.minDate, "DD/MM/YYYY").value} au ${
          useDateFormat(state.value.maxDate, "DD/MM/YYYY").value
        }`,
        alignment: "right",
      },
      { text: "", margin: [0, 10] },
      {
        margin: [5, 10],
        table: {
          widths: [170, 120],
          body: [
            // [
            //   { text: "N°Facture", style: "tableHeader" },
            //   { text: "Date", style: "tableHeader" },
            //   { text: "Prix", style: "tableHeader" },
            // ],

            [{ text: "Quantité Utilisé" }, { text: state.value.production.totalUsed }],
            [{ text: "Quantité Trié" }, { text: state.value.production.totalSorted }],
            [{ text: "Quantité Epluché" }, { text: state.value.production.totalPeeled }],
            [{ text: "Quantité Seché" }, { text: state.value.production.totalDried }],

            // ...state.value.map((PurshaseOrder) => {
            //   let total = 0

            //   PurshaseOrder.products.map((product) => {
            //     if (typeof product !== "number") {
            //       total += product.quantity * product.unit_price
            //     }
            //   })

            //   return [
            //     padInvoiceNumber(PurshaseOrder.id || 0).toString(),
            //     useDateFormat(PurshaseOrder.date, "DD/MM/YYYY").value,
            //     total.toString(),
            //   ]
            // }),
          ],
        },
      },
    ],
    styles: {
      title: {
        bold: true,
        fontSize: 28,
      },
      tableHeader: {
        bold: true,
        fontSize: 13,
      },
    },
  }

  console.log(doc.content)

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
  {{ state }}
</template>
