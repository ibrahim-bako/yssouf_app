<script setup lang="ts">
import { DirectusQueryParams } from "nuxt-directus/dist/runtime/types"
import { components } from "~/interfaces/nuxtus"
type Consumer = components["schemas"]["ItemsConsumer"]

definePageMeta({
  middleware: ["auth"],
})

const { getItems } = useDirectusItems()

const requestParams = reactive({} as DirectusQueryParams)

const { data, refresh, pending, error, execute } = useAsyncData(
  async () => {
    return await getItems<Consumer>({
      collection: "consumer",
      params: requestParams,
    })
  },
  { lazy: true, server: true, immediate: true }
)

const handleClickRow = (event: Event, row: Consumer, index: number) => {
  navigateTo("/consumer/" + row.id)
}

const table = reactive({
  columns: [
    { name: "id", label: "ID", field: "id", sortable: false },
    { name: "name", label: "NAME", field: "name", sortable: false },
    { name: "tel", label: "Téléphone", field: "tel", sortable: false },
    { name: "rccm", label: "RCCM", field: "rccm", sortable: false },
    { name: "ifu", label: "IFU", field: "ifu", sortable: false },
  ],
  rows: [] as Consumer[],
})

watch([requestParams], () => {
  refresh()
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
          @click="navigateTo('/consumer/add')"
          label="Ajouté un client"
          icon="add"
          color="green"
        />
      </template>
    </top-bar>
    <q-table
      title="Clients"
      :columns="table.columns"
      :rows="table.rows"
      row-key="id"
      :loading="pending"
      class="h-[75vh]"
      flat
      :rows-per-page-options="[0]"
      virtual-scroll
      hide-pagination
      @row-click="handleClickRow"
    >
      <template v-slot:top-right>
        <q-input outlined dense debounce="300" v-model="requestParams.search" placeholder="Search">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>
    </q-table>
  </div>
</template>
