<script setup lang="ts">
import moment from "moment"
import { Failure } from "~~/domain/Failure"

definePageMeta({
  middleware: ["auth"],
})

const $q = useQuasar()

type State = {
  minDate: Date
  maxDate: Date
  sellsProducts: { name: string; weight: number }[]
  ordersProducts: { name: string; weight: number }[]
}

const state = ref({
  minDate: moment().startOf("day").toDate(),
  maxDate: moment().endOf("day").toDate(),
  sellsProducts: [],
  ordersProducts: [],
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
      const response1 = await getPurshaseOrdersProductsBetweenDates.execute({
        minDate: state.value.minDate,
        maxDate: state.value.maxDate,
      })

      if (response1 instanceof Failure) throw new Failure()
      console.log("response1", response1)

      const response2 = await getSellInvoicesProductsBetweenDates.execute({
        minDate: state.value.minDate,
        maxDate: state.value.maxDate,
      })

      if (response2 instanceof Failure) throw new Failure()
      console.log("response2", response2)

      state.value.sellsProducts = response1

      state.value.ordersProducts = response2
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
      { text: "Etats des quantités", style: "title", margin: [0, 0, 0, 20], alignment: "center" },
      { text: "Du 02/25/2023 au 02/25/2023", alignment: "right" },
      { text: " ", margin: [0, 0] },
      { text: "Quantité acheter", style: "title2" },
      {
        margin: [5, 10],
        table: {
          widths: [170, 120],
          body: [
            [
              { text: "Désignation", style: "tableHeader" },
              { text: "Quantité (kg)", style: "tableHeader" },
            ],
            ...state.value.ordersProducts.map((order) => [
              order.name,
              formatNumberToDisplay(order.weight),
            ]),
            [
              { text: "Total", style: "tableHeader" },
              {
                text: formatNumberToDisplay(
                  state.value.ordersProducts.reduce((add, a) => add + a.weight, 0)
                ),
                style: "tableHeader",
              },
            ],
          ],
        },
      },
      { text: " ", margin: [0, 0] },
      { text: "Quantité vendue", style: "title2" },
      {
        margin: [5, 10],
        table: {
          widths: [170, 120],
          body: [
            [
              { text: "Désignation", style: "tableHeader" },
              { text: "Quantité", style: "tableHeader" },
            ],
            ...state.value.sellsProducts.map((sell) => [
              sell.name,
              formatNumberToDisplay(sell.weight),
            ]),
            [
              { text: "Total", style: "tableHeader" },
              {
                text: formatNumberToDisplay(
                  state.value.sellsProducts.reduce((add, a) => add + a.weight, 0)
                ),
                style: "tableHeader",
              },
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
