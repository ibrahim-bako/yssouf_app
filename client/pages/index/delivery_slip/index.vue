<script setup lang="ts">
import { DirectusQueryParams } from "nuxt-directus/dist/runtime/types"
import { components } from "~/interfaces/nuxtus"
type DeliverySlip = components["schemas"]["ItemsDeliverySlip"]
type Provider = components["schemas"]["ItemsProvider"]

definePageMeta({
  middleware: ["auth"],
})

const { getItems } = useDirectusItems()

const requestParams = reactive<DirectusQueryParams>({
  fields: ["id", "date", "products", "provider.name"],
})

const { data, refresh, pending, error, execute } = useAsyncData(
  async () => {
    return await getItems<DeliverySlip>({
      collection: "delivery_slip",
      params: requestParams,
    })
  },
  { lazy: true, server: true, immediate: true, watch: [requestParams] }
)

const handleClickRow = (event: Event, row: DeliverySlip, index: number) => {
  navigateTo("/delivery_slip/" + row.id)
}

const table = reactive({
  columns: [
    {
      name: "id",
      label: "N°",
      field: "id",
      classes: "w-20",
      format: (val: string) => padInvoiceNumber(parseInt(val)),
    },
    {
      name: "provider",
      label: "Fournisseur",
      field: "provider",
      classes: "w-20",
      format: (val: Provider) => val.name,
    },
    {
      name: "date",
      label: "Date",
      field: "date",
      classes: "w-20",
      format: (val: string) => useDateFormat(val, "DD/MM/YYYY").value,
    },
  ],
  rows: [] as DeliverySlip[],
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
          @click="navigateTo('/delivery_slip/add')"
          label="Ajouté un bordereau"
          icon="add"
          color="green"
        />
      </template>
    </top-bar>
    <div class="">
      <q-table
        title="Bordereau de livraison"
        :columns="table.columns"
        :rows="table.rows"
        row-key="id"
        flat
        :rows-per-page-options="[0]"
        class="h-[75vh]"
        virtual-scroll
        hide-pagination
        :loading="pending"
        @row-click="handleClickRow"
      >
        <template v-slot:top-right>
          <q-input
            outlined
            dense
            debounce="300"
            v-model="requestParams.search"
            placeholder="Search"
          >
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </template>
      </q-table>
    </div>
  </div>
</template>
