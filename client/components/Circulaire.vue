<template>
  <div class="w-72 h-72">
    <canvas ref="docs"></canvas>
  </div>
</template>

<script setup lang="ts">
import Chart, { ChartConfiguration, ChartData, ChartItem, ChartOptions } from "chart.js/auto"
import { onMounted } from "vue"
import moment from "moment"

const firstDay = ref(moment().startOf("month").toISOString())

const lastDay = ref(moment().endOf("month").toISOString())

const { getItems } = useDirectusItems()

const facture = ref<Facture[] | null>(null)
const bon = ref<Bon[] | null>(null)

type Facture = {
  id?: string | number
  advence_paid: number
  date: string
  sort: number
  consumer: number
  products: {
    quantity: number
    unit_price: number
  }[]
}
type Bon = {
  id?: string | number
  advence_paid: number
  sort: number
  date: string
  products: {
    quantity: number
    unit_price: number
  }[]
}

const fetchFacture = async () => {
  try {
    const filters = {
      date: {
        _between: [firstDay.value, lastDay.value],
      },
    }
    facture.value = await getItems<Facture>({
      collection: "sell_invoice",
      params: {
        fields: ["id", "date", "products.quantity", "products.unit_price"],
        filter: filters,
      },
    })
  } catch (e) {
    console.log("error", e)
  }
}

const fetchBon = async () => {
  try {
    const filters = {
      date: {
        _between: [firstDay.value, lastDay.value],
      },
    }
    bon.value = await getItems<Bon>({
      collection: "purshase_order",
      params: {
        fields: ["id", "date", "products.quantity", "products.unit_price"],
        filter: filters,
      },
    })
  } catch (e) {
    console.log("error", e)
  }
}

const factureSum = computed(() => {
  const products = facture.value?.map((elem) =>
    elem.products.map((el) => el.quantity * el.unit_price)
  )
  console.log(products)
  let total = 0

  for (const product of products || []) {
    let sum = product?.reduce((a, b) => a + b, 0)

    total += sum
  }

  return total
})

const bonSum = computed(() => {
  const bons = bon.value?.map((elem) => elem.products.map((el) => el.quantity * el.unit_price))
  console.log(bons)
  let totalbon = 0
  for (const bon of bons || []) {
    let somme = bon?.reduce((a, b) => a + b, 0)
    totalbon += somme
  }
  return totalbon
})

const date = computed(() => {
  return facture.value?.map((el) => el.date)
})

const circleData = computed(() => {
  const sumTotal = factureSum.value + bonSum.value
  const bonPourcentage = (bonSum.value * 100) / sumTotal
  const facturePourcentage = (factureSum.value * 100) / sumTotal
  return [parseInt(bonPourcentage.toString()), parseInt(facturePourcentage.toString())]
})

const data = computed(() => {
  let op: ChartData = {
    labels: ["Pourcentage d' Achat", "Pourcentage de Vente"],
    datasets: [
      {
        backgroundColor: ["blue", "green"],
        data: circleData.value,
      },
    ],
  }
  return op
})
const config = computed(() => {
  let p: ChartConfiguration = {
    type: "pie",
    data: data.value,
  }
  return p
})

const docs = ref<ChartItem | null>(null)

watchEffect(() => {
  if (docs.value && facture.value && bon.value) {
    const myChart = new Chart(docs.value, config.value)
  }
})

onMounted(() => {
  fetchFacture()
  fetchBon()
})
</script>
