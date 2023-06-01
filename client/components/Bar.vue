<template>
  <div class="w-96 h-96">
    <canvas ref="docs"></canvas>
  </div>
</template>

<script setup lang="ts">
import Chart, { ChartConfiguration, ChartData, ChartItem, ChartOptions } from "chart.js/auto"
import { components } from "~/interfaces/nuxtus"
import { onMounted } from "vue"
import moment from "moment"

type DailyWork = components["schemas"]["ItemsDailyWork"]
type DeliverySlip = components["schemas"]["ItemsDeliverySlip"]
type Product = components["schemas"]["ItemsProduct"]

const { logout } = useDirectusAuth()
const { getItems } = useDirectusItems()

const { data: weeks } = useAsyncData(async () => {
  let weeks = {
    week1: {
      max: moment().startOf("day").toISOString(),
      min: moment().subtract(7, "days").endOf("day").toISOString(),
      paid_weigth: 0,
      make_weigth: 0,
    },
    week2: {
      max: moment().subtract(7, "days").startOf("day").toISOString(),
      min: moment().subtract(14, "days").endOf("day").toISOString(),
      paid_weigth: 0,
      make_weigth: 0,
    },
    week3: {
      max: moment().subtract(14, "days").startOf("day").toISOString(),
      min: moment().subtract(21, "days").endOf("day").toISOString(),
      paid_weigth: 0,
      make_weigth: 0,
    },
    week4: {
      max: moment().subtract(21, "days").startOf("day").toISOString(),
      min: moment().subtract(28, "days").endOf("day").toISOString(),
      paid_weigth: 0,
      make_weigth: 0,
    },
  }

  for (const [key, value] of Object.entries(weeks)) {
    const delivery_slips = await getItems<DeliverySlip>({
      collection: "delivery_slip",
      params: {
        fields: ["*", "products.*"],
        filter: {
          date: {
            _between: [value.min, value.max],
          },
        },
      },
    })

    let paid_weigth = 0
    for (const invoice of delivery_slips) {
      for (const product of invoice.products || []) {
        // @ts-ignore
        if (product.weigth) {
          // @ts-ignore
          paid_weigth += product.weigth
        }
      }
    }
    switch (key) {
      case "week1":
        weeks.week1.paid_weigth = paid_weigth
        continue
      case "week2":
        weeks.week2.paid_weigth = paid_weigth
        continue
      case "week3":
        weeks.week3.paid_weigth = paid_weigth
        continue
      case "week4":
        weeks.week4.paid_weigth = paid_weigth
        continue
    }
  }

  for (const [key, value] of Object.entries(weeks)) {
    const daily_works = await getItems<DailyWork>({
      collection: "daily_work",
      params: {
        fields: ["*"],
        filter: {
          date: {
            _between: [value.min, value.max],
          },
        },
      },
    })

    let make_weigth = 0
    for (const day of daily_works) {
      if (day.dried_quantity) {
        make_weigth += day.dried_quantity
      }
    }
    switch (key) {
      case "week1":
        weeks.week1.make_weigth = make_weigth
        continue
      case "week2":
        weeks.week2.make_weigth = make_weigth
        continue
      case "week3":
        weeks.week3.make_weigth = make_weigth
        continue
      case "week4":
        weeks.week4.make_weigth = make_weigth
        continue
    }
  }

  return weeks
})

const labels = ["1ère Sem", "2ème Sem", "3ème Sem", "4ème Sem"]

const data = computed(() => {
  const data: ChartData = {
    labels: labels,
    datasets: [
      {
        label: "bande 1",
        borderColor: "#c5d3ce",
        backgroundColor: "#e35010",
        data: [
          weeks.value!.week1.paid_weigth,
          weeks.value!.week2.paid_weigth,
          weeks.value!.week3.paid_weigth,
          weeks.value!.week4.paid_weigth,
        ],
      },
      {
        label: "bande 2",
        borderColor: "#d0e0e0",
        backgroundColor: "#10e3dc",
        data: [
          weeks.value!.week1.make_weigth,
          weeks.value!.week2.make_weigth,
          weeks.value!.week3.make_weigth,
          weeks.value!.week4.make_weigth,
        ],
      },
    ],
  }

  return data
})

const docs = ref<ChartItem | null>(null)

const config = computed(() => {
  const config: ChartConfiguration = {
    type: "bar",
    data: data.value,
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  }

  return config
})

watchEffect(() => {
  if (docs.value && config.value) {
    const myChart = new Chart(docs.value, config.value)
  }
})

onMounted(() => {})
</script>
