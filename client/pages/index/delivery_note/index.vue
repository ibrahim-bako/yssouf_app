<script setup lang="ts">
import { DirectusQueryParams } from "nuxt-directus/dist/runtime/types"
import { components } from "~/interfaces/nuxtus"
type DeliveryNote = components["schemas"]["ItemsDeliveryNote"]
type Consumer = components["schemas"]["ItemsConsumer"]

definePageMeta({
  middleware: ["auth"],
})

const { getItems } = useDirectusItems()

const search = ref("")

const { data, refresh, pending, error, execute } = useAsyncData(
  async () => {
    return await getItems<DeliveryNote>({
      collection: "delivery_note",
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

const handleClickRow = (event: Event, row: DeliveryNote, index: number) => {
  navigateTo("/delivery_note/" + row.id)
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
  rows: [] as DeliveryNote[],
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
          @click="navigateTo('/delivery_note/add')"
          label="Créer un bon de livraison"
          icon="add"
          color="green"
        />
      </template>
    </top-bar>
    <div class="">
      <q-table
        title="Bons de Livraison"
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
