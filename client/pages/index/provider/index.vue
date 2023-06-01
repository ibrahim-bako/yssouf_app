<script setup lang="ts">
import { DirectusQueryParams } from "nuxt-directus/dist/runtime/types"
import { components } from "~/interfaces/nuxtus"
definePageMeta({
  middleware: ["auth"],
})

type Provider = components["schemas"]["ItemsProvider"]

const { getItems } = useDirectusItems()

const requestParams = reactive({} as DirectusQueryParams)

const { data, refresh, pending, error, execute } = useAsyncData(
  async () => {
    return await getItems<Provider>({
      collection: "provider",
      params: requestParams,
    })
  },
  { lazy: true, server: true, immediate: true }
)

const handleClickRow = (event: Event, row: Provider, index: number) => {
  navigateTo("/provider/" + row.id)
}

const table = reactive({
  columns: [
    { name: "id", label: "ID", field: "id", sortable: false },
    { name: "name", label: "NAME", field: "name", sortable: false },
    { name: "tel", label: "Téléphone", field: "tel", sortable: false },
    { name: "ifu", label: "IFU", field: "ifu", sortable: false },
    { name: "rccm", label: "RCCM", field: "rccm", sortable: false },
  ],
  rows: [] as Provider[],
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
    <div>
      <top-bar>
        <template v-slot:right>
          <q-btn
            @click="navigateTo('/provider/add')"
            label="Ajouté un fournisseur"
            icon="add"
            color="green"
          />
        </template>
      </top-bar>
      <q-table
        title="Fournisseurs"
        :columns="table.columns"
        :rows="table.rows"
        row-key="id"
        class="h-[75vh]"
        flat
        virtual-scroll
        :rows-per-page-options="[0]"
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
