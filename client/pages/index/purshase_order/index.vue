<script setup lang="ts">
import { DirectusQueryParams } from "nuxt-directus/dist/runtime/types"
import { components } from "~/interfaces/nuxtus"
type PurshaseOrder = components["schemas"]["ItemsPurshaseOrder"]
type Provider = components["schemas"]["ItemsProvider"]

definePageMeta({
  middleware: ["auth"],
})

const { getItems } = useDirectusItems()

const requestParams = reactive({
  fields: ["id", "date", "products", "provider.name"],
  sort: ["-id"],
} as DirectusQueryParams)

const { data, refresh, pending, error, execute } = useAsyncData(
  async () => {
    return await getItems<PurshaseOrder>({
      collection: "purshase_order",
      params: requestParams,
    })
  },
  { lazy: true, server: true, immediate: true, watch: [requestParams] }
)

const handleClickRow = (event: Event, row: PurshaseOrder, index: number) => {
  navigateTo("/purshase_order/" + row.id)
}

const table = reactive({
  columns: [
    {
      name: "id",
      label: "N°",
      field: "id",
      format: (val: string) => padInvoiceNumber(parseInt(val)),
    },
    {
      name: "provider",
      label: "Fournisseur",
      field: "provider",
      format: (val: Provider) => val.name,
    },
    {
      name: "date",
      label: "Date",
      field: "date",
      format: (val: string) => useDateFormat(val, "DD/MM/YYYY").value,
    },
  ],
  rows: [] as PurshaseOrder[],
})

watch([data], () => {
  table.rows = data.value || []
})
</script>

<template>
  <div>
    <top-bar>
      <template v-slot:right>
        <q-btn
          @click="navigateTo('/purshase_order/add')"
          label="Créer un bon de commande"
          icon="add"
          color="green"
        />
      </template>
    </top-bar>
    <div class="">
      <q-table
        title="Bon de commande"
        :columns="table.columns"
        :rows="table.rows"
        row-key="id"
        flat
        class="h-[75vh]"
        virtual-scroll
        :rows-per-page-options="[0]"
        hide-pagination
        :loading="pending"
        @row-click="handleClickRow"
      >
        <template v-slot:top-right>
          <div class="flex space-x-5">
            <q-input outlined dense debounce="300" v-model="requestParams.search" placeholder="N° ">
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
          </div>
        </template>
      </q-table>
    </div>
  </div>
</template>
