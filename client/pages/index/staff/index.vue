<script setup lang="ts">
import { DirectusQueryParams } from "nuxt-directus/dist/runtime/types"
import { components } from "~/interfaces/nuxtus"

definePageMeta({
  middleware: ["auth"],
})

type Staff = components["schemas"]["ItemsStaff"]

const { getItems } = useDirectusItems()

const requestParams = reactive({ limit: -1 } as DirectusQueryParams)

const { data, refresh, pending, error, execute } = useAsyncData(
  async () => {
    return await getItems<Staff>({
      collection: "staff",
      params: requestParams,
    })
  },
  { lazy: true, server: true, immediate: true, watch: [requestParams] }
)

const handleClickRow = (event: Event, row: Staff, index: number) => {
  navigateTo("/staff/" + row.id)
}

const table = reactive({
  columns: [
    { name: "id", label: "ID", field: "id" },
    { name: "last_name", label: "Nom", field: "last_name" },
    { name: "first_name", label: "Prénom", field: "first_name" },
    { name: "tel", label: "Téléphone", field: "tel" },
    {
      name: "birthday",
      label: "Date de naissance",
      field: "birthday",
      format: (val: string) => useDateFormat(val, "DD/MM/YYYY").value,
    },
    { name: "card_number", label: "CNIB", field: "card_number" },
    {
      name: "sex",
      label: "sexe",
      field: "sex",
      format: (val: string) => (val === "woman" ? "Feminin" : "Masculin"),
    },
  ],
  rows: [] as Staff[],
})

watch([data], () => {
  table.rows = data.value || []
})
</script>

<template>
  <div>
    <top-bar>
      <template v-slot:right>
        <div class="flex space-x-5">
          <q-btn
            @click="navigateTo('/staff/add')"
            label="Ajouté une personne"
            icon="add"
            dense
            color="green"
          />
        </div>
      </template>
    </top-bar>
    <q-table
      title="Personnel"
      flat
      :columns="table.columns"
      :rows="table.rows"
      row-key="id"
      :loading="pending"
      class="h-[80vh]"
      virtual-scroll
      :rows-per-page-options="[0]"
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
