<template>
  <div class="w-96 h-96">
    <canvas id="myChart" ref="doc"></canvas>
  </div>
</template>

<script setup lang="ts">
import Chart, { ChartConfiguration, ChartItem, ChartOptions } from "chart.js/auto"
import { onMounted } from "vue"
import moment from "moment"

const days = ref(moment().startOf("week").add(1, "day"))

const endDay = ref(moment().endOf("week").subtract(1, "day"))

const { getItems } = useDirectusItems()

const datas = ref<Quantite[] | null>(null)

type Quantite = {
  id?: string | number
  date: string
  used_quantity: number
  sorted_quantity: number
  peeled_quantity: number
  dried_quantity: number
}

const fetchQuantite = async () => {
  try {
    const filters = {
      date: {
        _between: [days.value.toString(), endDay.value.toString()],
      },
    }
    datas.value = await getItems<Quantite>({
      collection: "daily_work",
      params: {
        fields: ["id", "date", "dried_quantity"],
        filter: filters,
      },
    })
  } catch (e) {
    console.log("error", e)
  }
}

const labels = computed(() => {
  return datas.value?.map((el) => moment(el.date).format("dddd"))
})
const quantities = computed<number[]>(() => {
  let q = datas.value?.map((el) => el.dried_quantity)
  return q || []
})

const config = computed(() => {
  let op: ChartConfiguration = {
    type: "line",
    data: {
      labels: labels.value,
      datasets: [
        {
          label: "Quantité de mangue sechée par jour",
          backgroundColor: "aqua",
          borderColor: "black",
          data: quantities.value,
        },
      ],
    },
    options: {},
  }

  return op
})

const doc = ref<ChartItem | null>(null)

watchEffect(() => {
  if (doc.value && datas.value) {
    const myChart = new Chart(doc.value, config.value)
  }
})

onMounted(async () => {
  await fetchQuantite()
})
</script>
