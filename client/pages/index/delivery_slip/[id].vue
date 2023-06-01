<script setup lang="ts">
import { components } from "~/interfaces/nuxtus"
type DeliverySlip = components["schemas"]["ItemsDeliverySlip"]
type Provider = components["schemas"]["ItemsProvider"]
type Product = components["schemas"]["ItemsProduct"]

definePageMeta({
  middleware: ["auth"],
})

const { getItemById, getItems } = useDirectusItems()
const { params } = useRoute()

const $q = useQuasar()

const delivery_slip = computed(() => {
  if (data.value) {
    return data.value
  }
  return {} as DeliverySlip
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

const { data, refresh, pending, error, execute } = useAsyncData(
  async () => {
    return await getItemById<DeliverySlip>({
      collection: "delivery_slip",
      id: params.id as string,
      params: {
        fields: ["*", "provider.*", "products.*"],
      },
    })
  },
  {
    lazy: true,
    server: true,
    immediate: true,
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
    footer: [],
    content: [
      {
        width: 75,
        image: logo,
      },
      { text: "Produits agro-alimentaire.", style: "para" },
      {
        text: "____________________________________________________________________________",
        margin: [30, 0],
      },

      {
        text: `BORDEREAU DE LIVRAISON N° ${padInvoiceNumber(delivery_slip.value.id!)}`,
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
              { text: provider.value.tel, style: "firstTableBody" },
              {
                text: delivery_slip.value.date,
                style: "firstTableBody",
              },
              { text: provider.value.name, style: "firstTableBody" },
            ],
          ],
        },
      },
      { text: " " },
      { text: " " },
      { text: " " },
      {
        margin: [30, 0],
        table: {
          widths: [150, 80, 180],
          body: [
            [
              { text: "Variété", style: "exemple" },
              { text: "Nature", style: "exemple" },
              { text: "Quantité", style: "exemple" },
            ],
          ],
        },
      },
      {
        text: "Réceptionné le .................................................................... ",
        margin: [0, 30],
        italics: true,
      },
      { text: "Pour Boussole", alignment: "left" },
      { text: "Pour le Fournisseur", alignment: "right" },

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
        fontSize: 21,
        margin: [0, 30, 20, 20],
      },
      firstTableHead: {
        bold: true,
        fontSize: 16,
      },
      firstTableBody: {
        fontSize: 14,
      },
      para: {
        fontSize: 8,
        margin: [140, 0],
      },
    },
  }

  products.value.map((product) =>
    // @ts-ignore
    doc.content[8].table.body.splice(1, 0, [product.designation, product.type, product.quantity])
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
      <div>
        <embed :src="pdfUrl" width="800" height="1200" type="application/pdf" />
      </div>
    </div>
  </div>
</template>
