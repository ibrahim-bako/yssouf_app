<script setup lang="ts">
import { components } from "~/interfaces/nuxtus"
import moment from "moment"

// definePageMeta({
//   middleware: [
//     function (to, _from) {
//       return navigateTo("/consumer")
//     },
//   ],
// })

type DailyWork = components["schemas"]["ItemsDailyWork"]
type DeliverySlip = components["schemas"]["ItemsDeliverySlip"]
type Product = components["schemas"]["ItemsProduct"]

const { logout } = useDirectusAuth()
const { getItems } = useDirectusItems()

// const { data: weeks } = useAsyncData(async () => {
//   let weeks = {
//     week1: {
//       max: moment().startOf("day").toISOString(),
//       min: moment().subtract(7, "days").endOf("day").toISOString(),
//       paid_weigth: 0,
//       make_weigth: 0,
//     },
//     week2: {
//       max: moment().subtract(7, "days").startOf("day").toISOString(),
//       min: moment().subtract(14, "days").endOf("day").toISOString(),
//       paid_weigth: 0,
//       make_weigth: 0,
//     },
//     week3: {
//       max: moment().subtract(14, "days").startOf("day").toISOString(),
//       min: moment().subtract(21, "days").endOf("day").toISOString(),
//       paid_weigth: 0,
//       make_weigth: 0,
//     },
//     week4: {
//       max: moment().subtract(21, "days").startOf("day").toISOString(),
//       min: moment().subtract(28, "days").endOf("day").toISOString(),
//       paid_weigth: 0,
//       make_weigth: 0,
//     },
//   }

//   for (const [key, value] of Object.entries(weeks)) {
//     const delivery_slips = await getItems<DeliverySlip>({
//       collection: "delivery_slip",
//       params: {
//         fields: ["*", "products.*"],
//         filter: {
//           date: {
//             _between: [value.min, value.max],
//           },
//         },
//       },
//     })

//     let paid_weigth = 0
//     for (const invoice of delivery_slips) {
//       for (const product of invoice.products || []) {
//         // @ts-ignore
//         if (product.weigth) {
//           // @ts-ignore
//           paid_weigth += product.weigth
//         }
//       }
//     }
//     switch (key) {
//       case "week1":
//         weeks.week1.paid_weigth = paid_weigth
//         continue
//       case "week2":
//         weeks.week2.paid_weigth = paid_weigth
//         continue
//       case "week3":
//         weeks.week3.paid_weigth = paid_weigth
//         continue
//       case "week4":
//         weeks.week4.paid_weigth = paid_weigth
//         continue
//     }
//   }

//   for (const [key, value] of Object.entries(weeks)) {
//     const daily_works = await getItems<DailyWork>({
//       collection: "daily_work",
//       params: {
//         fields: ["*"],
//         filter: {
//           date: {
//             _between: [value.min, value.max],
//           },
//         },
//       },
//     })

//     let make_weigth = 0
//     for (const day of daily_works) {
//       if (day.dried_quantity) {
//         make_weigth += day.dried_quantity
//       }
//     }
//     switch (key) {
//       case "week1":
//         weeks.week1.make_weigth = make_weigth
//         continue
//       case "week2":
//         weeks.week2.make_weigth = make_weigth
//         continue
//       case "week3":
//         weeks.week3.make_weigth = make_weigth
//         continue
//       case "week4":
//         weeks.week4.make_weigth = make_weigth
//         continue
//     }
//   }

//   return weeks
// })
</script>

<template>
  <div>
    <nav class="flex justify-between">
      <img src="/img/boussole.jpg" alt="Boussole" class="w-32" />
      <q-btn class="h-min" color="primary" label="Deconnexion" @click="logout()" />
    </nav>
    <!-- <h3 class="titre">Gestion d'une entreprise</h3> -->
  </div>
  <div class="flex flex-wrap w-4/5 mx-auto">
    <Graphe />
    <Circulaire />
    <!-- <Bar /> -->
  </div>
</template>
