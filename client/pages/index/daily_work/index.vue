<script setup lang="ts">
import { components } from "~/interfaces/nuxtus"
type DailyWork = components["schemas"]["ItemsDailyWork"]

definePageMeta({
  middleware: ["auth"],
})

const { getItems } = useDirectusItems()

const dateSearch = ref<string>("")

const { data, refresh, pending, error, execute } = useAsyncData(
  async () => {
    return await getItems<DailyWork>({
      collection: "daily_work",
      params: {
        filter: {
          date: dateSearch.value ? formatDateNoneToIosString(dateSearch.value) : undefined,
        },
      },
    })
  },
  { lazy: true, server: true, immediate: true, watch: [dateSearch] }
)

const handleClickRow = (event: Event, row: DailyWork, index: number) => {
  navigateTo("/dauly_work/" + row.id)
}

const table = reactive({
  columns: [
    {
      name: "id",
      label: "ID",
      field: "id",
    },
    {
      name: "date",
      label: "Date",
      field: "date",
      format: (val: string) => useDateFormat(val, "DD/MM/YYYY").value,
    },
    {
      name: "used_quantity",
      label: "Quantité Utilisé",
      field: "used_quantity",
      format: (val: number) => `${formatNumberToDisplay(val)} kg`,
    },
    {
      name: "sorted_quantity",
      label: "Quantité Trié",
      field: "sorted_quantity",
      format: (val: number) => `${formatNumberToDisplay(val)} kg`,
    },
    {
      name: "peeled_quantity",
      label: "Quantité Epluché",
      field: "peeled_quantity",
      format: (val: number) => `${formatNumberToDisplay(val)} kg`,
    },
    {
      name: "dried_quantity",
      label: "Quantité Séché",
      field: "dried_quantity",
      format: (val: number) => `${formatNumberToDisplay(val)} kg`,
    },
  ],
  rows: [] as DailyWork[],
})

watchEffect(() => {
  table.rows = data.value || []
})
</script>

<template>
  <div>
    <top-bar>
      <template v-slot:right>
        <div class="space-x-8">
          <NuxtLink to="/daily_work/statement">
            <q-btn label="etat de production" dense outline />
          </NuxtLink>
          <q-btn @click="navigateTo('/daily_work/add')" label="Ajouté" icon="add" color="green" />
        </div>
      </template>
    </top-bar>
    <div>
      <q-table
        title="Compte journalier"
        :columns="table.columns"
        :rows="table.rows"
        row-key="id"
        :rows-per-page-options="[0]"
        flat
        class="h-[75vh]"
        virtual-scroll
        hide-pagination
        :loading="pending"
        @row-click=""
      >
        <template v-slot:top-right>
          <q-input clearable outlined dense type="date" v-model="dateSearch" />
        </template>
      </q-table>
    </div>
  </div>
</template>
