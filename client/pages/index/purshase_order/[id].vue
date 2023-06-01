<script setup lang="ts">
import { components } from "~/interfaces/nuxtus"
type PurshaseOrder = components["schemas"]["ItemsPurshaseOrder"]
type Provider = components["schemas"]["ItemsProvider"]
type Product = components["schemas"]["ItemsProduct"]

definePageMeta({
  middleware: ["auth"],
})

const { getItemById, getItems } = useDirectusItems()
const { params } = useRoute()
const $q = useQuasar()

const purshase_order = computed(() => {
  if (data.value) {
    return data.value
  }
  return {} as PurshaseOrder
})

const provider = computed(() => {
  if (data.value) {
    return data.value.provider as Provider
  }
  return {} as Provider
})

const products = computed(() => {
  if (data.value) {
    return data.value.products as Product[]
  }
  return [] as Product[]
})

const total = computed(() => {
  let total = 0

  products.value.map((product) => (total += product.quantity! * product.unit_price!))

  return total
})

const solde = computed(() => {
  return purshase_order.value.advence_paid
    ? total.value - purshase_order.value.advence_paid
    : total.value
})

const { data, refresh, pending, error, execute } = useAsyncData(
  async () => {
    return await getItemById<PurshaseOrder>({
      collection: "purshase_order",
      id: params.id as string,
      params: {
        fields: ["*", "provider.*", "products.*"],
      },
    })
  },
  {
    lazy: true,
    server: true,
    immediate: false,
    transform: (val) => ({ ...val, date: useDateFormat(val.date, "DD/MM/YYYY") }),
  }
)

import { TDocumentDefinitions } from "pdfmake/interfaces"
import * as pdfMake from "pdfmake/build/pdfmake"
import * as pdfFonts from "pdfmake/build/vfs_fonts"
import "pdfmake/build/vfs_fonts"

// @ts-ignore
pdfMake.vfs = pdfFonts.pdfMake.vfs

const doc = computed<TDocumentDefinitions>(() => {
  const doc: TDocumentDefinitions = {
    header: [],
    content: [
      {
        width: 75,
        image: logo,
      },
      {
        text: "____________________________________________________________________________",
        margin: [30, 0],
      },
      {
        text: `BON DE COMMANDE N° ${padInvoiceNumber(purshase_order.value.id!)}`,
        style: "titre",
        alignment: "center",
      },

      {
        margin: [30, 0],
        table: {
          widths: [150, 80, 180],
          body: [
            [
              { text: "Numero Telephone", style: "firstTableHead" },
              { text: "Date", style: "firstTableHead" },
              { text: "Réferences", style: "firstTableHead" },
            ],
            [
              { text: provider.value.tel!, style: "firstTableBody" },
              { text: purshase_order.value.date!, style: "firstTableBody" },
              { text: provider.value.name!, style: "firstTableBody" },
            ],
          ],
        },
      },
      { text: " " },
      { text: " " },
      { text: " " },
      {
        table: {
          widths: [130, 70, 70, 75, 110],
          body: [
            [
              { text: "Variété", style: "exemple" },
              { text: "Nature", style: "exemple" },
              { text: "Quantité", style: "exemple" },
              { text: "Prix Unitaire", style: "exemple" },
              { text: "Montant A Payé", style: "exemple" },
            ],
            // ["keit", "kg", "", "", ""],
            // products.value.map((product) => [
            //   product.designation,
            //   product.type,
            //   product.quantity,
            //   product.unit_price,
            //   product.unit_price! * product.quantity!,
            // ]),
            [{ text: "TOTAL", colSpan: 4 }, "", "", "", total.value],
            [
              { text: "Avance payé le ....", colSpan: 4 },
              "",
              "",
              "",
              purshase_order.value.advence_paid || 0,
            ],
            [{ text: "Solde", colSpan: 4 }, "", "", "", solde.value],
          ],
        },
      },
      {
        text: "Arrêté la présente facture à la somme de .................................................................FCFA ",
        margin: [0, 30],
      },
      { text: "Le Responsable", style: "abc" },
      {
        text: "____________________________________________________________________________",
        absolutePosition: { x: 95, y: 720 },
      },
      {
        text: "18 BP 310 Ouagadougou 18 Burkina Faso - tél : 76 20 20 97/69 69 10 69/76 17 81 81- Email : boussolesarl@gmail.com - RCCM : BFOUA2013B6342 – IFU : 00052156W",
        margin: [0, 10, 0, 0],
        absolutePosition: { x: 50, y: 740 },
      },
    ],
    styles: {
      exemple: {
        bold: true,
        fontSize: 13,
      },
      titre: {
        bold: true,
        fontSize: 24,
        margin: [0, 30, 20, 20],
      },
      firstTableHead: {
        bold: true,
        fontSize: 16,
      },
      firstTableBody: {
        fontSize: 14,
      },
      abc: {
        decoration: "underline",
        alignment: "right",
        bold: true,
      },
    },
  }

  products.value.map((product) =>
    // @ts-ignore
    doc.content[7].table.body.splice(1, 0, [
      product.designation,
      product.type,
      product.quantity,
      product.unit_price,
      product.unit_price! * product.quantity!,
    ])
  )

  return doc
})

const pdfUrl = ref("")

onMounted(() => {
  execute().then(() => {
    if (error.value) {
      return $q.notify({
        color: "red",
        message: error.value.name,
      })
    }

    pdfMake.createPdf(doc.value).getDataUrl((url) => (pdfUrl.value = url))
  })
})
</script>
<template>
  <div>
    <top-bar></top-bar>
    <div class="">
      <embed :src="pdfUrl" width="800" height="1200" type="application/pdf" />
    </div>
  </div>
</template>
