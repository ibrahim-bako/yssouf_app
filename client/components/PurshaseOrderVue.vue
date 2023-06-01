<script setup lang="ts">
import { components } from "~/interfaces/nuxtus"
type PurshaseOrder = components["schemas"]["ItemsPurshaseOrder"]
type Provider = components["schemas"]["ItemsProvider"]
type Product = components["schemas"]["ItemsProduct"]
type Settings = components["schemas"]["ItemsSettings"]

const { getSingletonItem } = useDirectusItems()

const props = defineProps<{
  purshase_order: PurshaseOrder
  provider: Provider
  products: Product[]
}>()

const { data: settings } = useAsyncData(async () => {
  return await getSingletonItem<Settings>({
    collection: "settings",
    id: "1",
  })
})

const total = computed(() => {
  let total = 0

  props.products.map((product) => {
    if (product.quantity && product.unit_price) {
      total += product.quantity * product.unit_price
    }
  })

  return total
})

const solde = computed(() => {
  return props.purshase_order.advence_paid ? total.value - props.purshase_order.advence_paid : 0
})

const purshaseRef = ref<HTMLElement | null>(null)

// @ts-ignore
import pdfMake from "pdfmake/build/pdfmake"
// @ts-ignore
import pdfFonts from "pdfmake/build/vfs_fonts"
pdfMake.vfs = pdfFonts.pdfMake.vfs

const docDefinition = ref({
  content: [
    {
      text: "This is a header, using header style",
      style: "header",
    },
    {
      style: "",
      color: "#000",
      table: {
        widths: ["auto", "auto", "auto"],
        headerRows: 2,
        // keepWithHeaderRows: 1,
        body: [
          [
            { text: "Numero téléphone", style: "tableHeader", alignment: "left" },
            { text: "Date", style: "tableHeader", alignment: "left" },
            { text: "Référence", style: "tableHeader", alignment: "left" },
          ],
          [
            { text: "226 54-37-76-01", style: "", alignment: "left" },
            { text: "18/05/2023", style: "", alignment: "left" },
            { text: "Yssouf", style: "", alignment: "left" },
          ],
        ],
      },
    },
    { text: " " },
    {
      style: "",
      color: "#000",
      table: {
        widths: ["auto", "auto", "auto"],
        // headerRows: 2,
        // keepWithHeaderRows: 1,
        body: [
          [
            { text: "VARIETE", style: "tableHeader", alignment: "left" },
            { text: "NATURE", style: "tableHeader", alignment: "left" },
            { text: "QUANTITE", style: "tableHeader", alignment: "left" },
            { text: "PRIX UNITAIRE", style: "tableHeader", alignment: "left" },
            { text: "MONTANT A PAYER", style: "tableHeader", alignment: "left" },
          ],
        ],
      },
    },
  ],
  styles: {
    header: {
      fontSize: 24,
      bold: true,
    },
    subheader: {
      fontSize: 15,
      bold: true,
    },
    quote: {
      italics: true,
    },
    small: {
      fontSize: 8,
    },
    tableHeader: {
      bold: true,
      fontSize: 13,
      color: "black",
    },
  },
})

const saveToPdf = () => {
  // pdfMake.createPdf(docDefinition.value).download()
  // console.log(purshaseRef.value)
  // exportToPDF("export.pdf", purshaseRef.value!, { unit: "pt" }, {})
}
</script>

<template>
  <q-btn outline dense @click="saveToPdf()" color="purple" label="save to pdf" />

  <div
    ref="purshaseRef"
    class="w-[595px] h-[842px] p-4 text-xs border border-black overflow-y-auto font-sans"
  >
    <div class="h-full w-full p-10 border border-red-400">
      <div class="flex">
        <img src="/img/boussole.jpg" alt="Boussole" class="w-32 h-20" />
        <p class="mt-14 ml-3">Produits agro - alimentaire.</p>
      </div>
      <hr class="bg-black h-px" />
      <p class="font-bold text-xl text-center uppercase my-5">
        Bon de commande N° {{ padInvoiceNumber(purshase_order.id!) }}
      </p>
      <table class="border-collapse w-full border-[.5px] h-16 border-slate-500 ...">
        <thead>
          <tr>
            <th class="border-[.5px] border-black">Numero téléphone</th>
            <th class="border-[.5px] border-black">Date</th>
            <th class="border-[.5px] border-black">References</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="border-[.5px] border-black">{{ provider.tel }}</td>
            <td class="border-[.5px] border-black">
              {{ useDateFormat(purshase_order.date, "DD/MM/YYYY") }}
            </td>
            <td class="border-[.5px] border-black">{{ provider.name }}</td>
          </tr>
        </tbody>
      </table>

      <br />

      <table class="border-collapse w-full border-[.5px] border-black">
        <thead>
          <tr>
            <th class="border-[.5px] border-black">VARIETE</th>
            <th class="border-[.5px] border-black">NATURE</th>
            <th class="border-[.5px] border-black">QUANTITE</th>
            <th class="border-[.5px] border-black">PRIX UNITAIRE</th>
            <th class="border-[.5px] border-black">MONTANT A PAYER</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in products">
            <td class="border-[.5px] border-black">{{ product.designation }}</td>
            <td class="border-[.5px] border-black">{{ product.type }}</td>
            <td class="border-[.5px] border-black">{{ product.quantity }}</td>
            <td class="border-[.5px] border-black">{{ product.unit_price }}</td>
            <td class="border-[.5px] border-black">
              {{ product.unit_price! * product.quantity! }}
            </td>
          </tr>
          <tr class="border-[.5px] border-black">
            <td class="col-span-3">TOTAL</td>
            <td></td>
            <td></td>
            <td></td>
            <td class="border-[.5px] border-black">{{ total }}</td>
          </tr>

          <tr class="border-[.5px] border-black">
            <td class="col-span-3">Avance reçue le.......</td>
            <td></td>
            <td></td>
            <td></td>
            <td class="border-[.5px] border-black">{{ purshase_order.advence_paid }}</td>
          </tr>
          <tr class="border-[.5px] border-black">
            <td class="col-span-3">Solde</td>
            <td></td>
            <td></td>
            <td></td>
            <td class="border-[.5px] border-black">{{ solde }}</td>
          </tr>
        </tbody>
      </table>
      <p class="my-9">
        Arrêtée la présente facture à la somme de
        ..............................................................FCFA
      </p>
      <div class="my-9">
        <p class="font-bold text-right"><u>Le Responsable</u></p>
      </div>
      <div class="h-px bg-black w-full mt-12 mb-2"></div>
      <div>
        <p class="">
          18 BP 310 Ouagadougou 18 Burkina Faso - tél : 76 20 20 97/69 69 10 69/76 17 81 81- Email :
          boussolesarl@gmail.com - RCCM : BFOUA2013B6342 – IFU : 00052156W
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
tr,
td,
th {
  padding: 4px;
}
</style>
