<script setup lang="ts">
import { components } from "~/interfaces/nuxtus"
type _Staff = components["schemas"]["ItemsStaff"]
type Presence = components["schemas"]["ItemsPresence"]

definePageMeta({
  middleware: ["auth"],
})

type Staff = _Staff & { presences: Presence[] }

const { getItems } = useDirectusItems()

const dateLimits = reactive<{ min: string | null; max: string | null }>({
  min: null,
  max: null,
})

const salaire = ref<number>(0)

const { data: staffs, refresh } = useAsyncData(
  async () => {
    let staffs = await getItems<Staff>({
      collection: "staff",
      params: {
        limit: -1,
        fields: ["id", "first_name", "last_name", "tel", "card_number"],
        filter: {
          active: true,
        },
      },
    })

    staffs = await Promise.all(
      staffs.map(async (staff) => {
        const presences = await getItems<Presence>({
          collection: "presence",
          params: {
            limit: -1,
            filter: {
              staff: staff.id,
              one: true,
              two: true,
              three: true,
              date:
                dateLimits.min && dateLimits.max
                  ? {
                      _between: [
                        formatDateNoneToIosString(dateLimits.min),
                        formatDateNoneToIosString(dateLimits.max),
                      ],
                    }
                  : undefined,
            },
          },
        })

        return { ...staff, presences }
      })
    )

    return staffs
  },
  { server: true, immediate: true, lazy: true, watch: [dateLimits] }
)

import { TDocumentDefinitions } from "pdfmake/interfaces"
import * as pdfMake from "pdfmake/build/pdfmake"
import * as pdfFonts from "pdfmake/build/vfs_fonts"
// @ts-ignore
pdfMake.vfs = pdfFonts.pdfMake.vfs

const doc = computed<TDocumentDefinitions>(() => {
  const doc: TDocumentDefinitions = {
    content: [
      { text: "Etat du personnel", style: "title", margin: [0, 20], alignment: "center" },
      { text: `Date de début: ${useDateFormat(dateLimits.min || Date.now(), "DD/MM/YYYY").value}` },
      { text: `Date de fin: ${useDateFormat(dateLimits.max || Date.now(), "DD/MM/YYYY").value}` },
      {
        margin: [5, 10],
        table: {
          widths: [140, 100, 90, 70, 80],
          body: [
            [
              { text: "Nom et Prénoms", style: "tableHeader" },
              { text: "Téléphone", style: "tableHeader" },
              { text: "CNIB", style: "tableHeader" },
              { text: "Nombre de jour présent", style: "tableHeader" },
              { text: "Salaire", style: "tableHeader" },
            ],
            // @ts-ignore
            ...staffs.value?.map(function (staff) {
              return [
                `${staff.last_name} ${staff.first_name}`,
                staff.tel,
                staff.card_number,
                staff.presences.length,
                staff.presences.length * salaire.value,
              ]
            }),
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

watchEffect(() => {
  if (staffs.value) {
    console.log(doc.value)
    pdfMake.createPdf(doc.value).getDataUrl((url) => (pdfUrl.value = url))
  }
})

const pdfUrl = ref("")

onMounted(() => {})
</script>

<template>
  <div>
    <top-bar>
      <template v-slot:right>
        <div class="flex space-x-5">
          <q-input outlined dense type="number" label="paye par jour" v-model="salaire" />
          <q-input outlined dense type="date" label="date minimal" v-model="dateLimits.min" />
          <q-input outlined dense type="date" label="date maximal" v-model="dateLimits.max" />
        </div>
      </template>
    </top-bar>
    <div class="ml-5">
      <embed :src="pdfUrl" width="800" height="1200" type="application/pdf" />
      <!-- <div class="p-4 w-2/3">
        <q-table
          hide-bottom
          flat
          :rows-per-page-options="[0]"
          bordered
          :rows="staffs || []"
          :columns="[ { name: 'fullName', label: 'Nom et Prénoms', format: (val: undefined, row: Staff) => `${row.last_name} ${row.first_name}` },
                { name: 'tel', label: 'Téléphone', field: 'tel'},
                { name: 'card_number', label: 'CNIB', field: 'card_number'},
                { name: 'number', label: 'Nombre de jour présent', format: (val: undefined, row: Staff) => row.presences.length },
                { name: 'salary', label: 'Salaire', classes: 'font-bold text-xl', format: (val: undefined, row: Staff) => row.presences.length * 1500 },
            ]"
          row-key="id"
        />
      </div> -->
    </div>
  </div>
</template>
