<script setup lang="ts">
import { DirectusQueryParams } from "nuxt-directus/dist/runtime/types"
import { components } from "~/interfaces/nuxtus"
type SellInvoice = components["schemas"]["ItemsSellInvoice"]
type Consumer = components["schemas"]["ItemsConsumer"]

definePageMeta({
  middleware: ["auth"],
})

const { getItems } = useDirectusItems()

const search = ref("")

const { data, refresh, pending, error, execute } = useAsyncData(
  async () => {
    return await getItems<SellInvoice>({
      collection: "sell_invoice",
      params: {
        filter: {
          id: search.value!.toString() || undefined,
        },
        fields: ["id", "date", "products", "consumer.name"],
      },
    })
  },
  { lazy: true, server: true, immediate: true, watch: [search] }
)

const handleClickRow = (event: Event, row: SellInvoice, index: number) => {
  navigateTo("/sell_invoice/" + row.id)
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
      name: "consumer",
      label: "Client",
      field: "consumer",
      format: (val: Consumer) => val.name,
    },
    {
      name: "date",
      label: "Date",
      field: "date",
      format: (val: string) => useDateFormat(val, "DD/MM/YYYY").value,
    },
  ],
  rows: [] as SellInvoice[],
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
          @click="navigateTo('/sell_invoice/add')"
          label="Créer un facture de vente"
          icon="add"
          color="green"
        />
      </template>
    </top-bar>
    <div class="">
      <q-table
        title="Factures de vente"
        :columns="table.columns"
        :rows="table.rows"
        row-key="id"
        flat
        class="h-[75vh]"
        :rows-per-page-options="[0]"
        virtual-scroll
        hide-pagination
        :loading="pending"
        @row-click="handleClickRow"
      >
        <template v-slot:top-right>
          <div class="flex space-x-5">
            <q-input outlined dense type="number" debounce="300" v-model="search" placeholder="N° ">
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
