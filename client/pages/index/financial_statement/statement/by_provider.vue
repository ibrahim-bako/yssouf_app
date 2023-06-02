<script setup lang="ts">
import moment from "moment"
import { Failure } from "~~/domain/Failure"
import { Provider } from "~~/domain/entities/Provider"
import { PurshaseOrder } from "~~/domain/entities/PurshaseOrder"

definePageMeta({
  middleware: ["auth"],
})

const $q = useQuasar()

type State = {
  minDate: Date
  maxDate: Date
  purshaseOrders: PurshaseOrder[]
  totalPrice: number
  provider: Provider | null
  providerList: Provider[]
}

const state = ref({
  minDate: moment().startOf("month").toDate(),
  maxDate: moment().endOf("month").toDate(),
  purshaseOrders: [],
  totalPrice: 0,
  provider: null,
  providerList: [],
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
  [() => state.value.minDate, () => state.value.maxDate, () => state.value.provider!],
  async () => {
    console.log("change")
    try {
      const response = await getOrderForProviderBetweenDatesUseCase.execute({
        providerId: state.value.provider?.id!,
        minDate: state.value.minDate,
        maxDate: state.value.maxDate,
      })

      if (response instanceof Failure) throw new Failure()
      console.log("response1", response)

      state.value.purshaseOrders = response.purshaseOrders
      state.value.totalPrice = response.totalPrice
    } catch (err) {
      console.log(err)
    }
  },
  { immediate: true }
)

onMounted(async () => {
  try {
    const response = await getAllProvidersUseCase.execute()
    if (response instanceof Failure) return new Failure()

    state.value.providerList = response
    state.value.provider = response[0]
  } catch (err) {
    return $q.notify({
      color: "red",
      message: "erreur de chanrgement des ressources. Recharger la page.",
    })
  }
})

import { TDocumentDefinitions } from "pdfmake/interfaces"
import "pdfmake/build/vfs_fonts"
import * as pdfMake from "pdfmake/build/pdfmake"
import * as pdfFonts from "pdfmake/build/vfs_fonts"

// @ts-ignore
pdfMake.vfs = pdfFonts.pdfMake.vfs

const doc = computed<TDocumentDefinitions>(() => {
  const doc: TDocumentDefinitions = {
    content: [
      { text: "Etat de Fournisseur", style: "title", margin: [0, 0, 0, 20], alignment: "center" },
      {
        text: `Du ${useDateFormat(state.value.minDate, "DD/MM/YYYY").value} au ${
          useDateFormat(state.value.maxDate, "DD/MM/YYYY").value
        }`,
        alignment: "right",
      },
      { text: `Nom: ${state.value.provider?.name}` },
      { text: `RCCM: ${state.value.provider?.rccm}` },
      { text: `IFU: ${state.value.provider?.ifu}` },
      { text: `Téléphone: ${state.value.provider?.tel}` },
      { text: "", margin: [0, 10] },
      {
        margin: [5, 10],
        table: {
          widths: [70, 120, 120],
          body: [
            [
              { text: "N°Facture", style: "tableHeader" },
              { text: "Date", style: "tableHeader" },
              { text: "Prix", style: "tableHeader" },
            ],

            ...state.value.purshaseOrders.map((PurshaseOrder) => {
              let total = 0

              PurshaseOrder.products.map((product) => {
                if (typeof product !== "number") {
                  total += product.quantity * product.unit_price
                }
              })

              return [
                padInvoiceNumber(PurshaseOrder.id || 0).toString(),
                useDateFormat(PurshaseOrder.date, "DD/MM/YYYY").value,
                formatNumberToDisplay(total),
              ]
            }),

            [
              { text: "Total", style: "tableHeader", colSpan: 2 },
              "",
              { text: formatNumberToDisplay(state.value.totalPrice), style: "tableHeader" },
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
    <q-select
      outlined
      dense
      v-model="state.provider"
      :options="state.providerList"
      option-label="name"
      label="fournisseur"
    />
    <q-input type="date" outlined dense v-model="minDate" label="min date" />
    <q-input type="date" outlined dense v-model="maxDate" label="max date" />
  </div>
  <div class="p-4">
    <embed :src="pdfUrl" width="800" height="1200" type="application/pdf" />
  </div>
  <!-- {{ state }} -->
</template>
