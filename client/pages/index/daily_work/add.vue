<script setup lang="ts">
import { components } from "~/interfaces/nuxtus"

type DailyWork = components["schemas"]["ItemsDailyWork"]

definePageMeta({
  middleware: ["auth"],
})

import validator from "validator"

const $q = useQuasar()
const { createItems } = useDirectusItems()
const router = useRouter()
const daily_work = reactive<DailyWork>({
  date: useDateFormat(Date.now(), "YYYY-MM-DD").value,
  used_quantity: 0,
  sorted_quantity: 0,
  dried_quantity: 0,
  peeled_quantity: 0,
})

const { data, execute, error } = useAsyncData(
  async () => {
    return await createItems<DailyWork[]>({
      collection: "daily_work",
      items: [{ ...daily_work, date: formatDateNoneToIosString(daily_work.date!) }],
    })
  },
  { lazy: true, server: true, immediate: false }
)

const onSave = async () => {
  try {
    for (const [key, value] of Object.entries(daily_work)) {
      if (
        key === "used_quantity" ||
        key === "dried_quantity" ||
        key === "peeled_quantity" ||
        key === "sorted_quantity"
      ) {
        if (!value) {
          return $q.notify({
            color: "red",
            message: `${key} est obligatoire`,
          })
        }

        if (!validator.isNumeric(value.toString())) {
          return $q.notify({
            color: "red",
            message: `${key} doit être un nombre`,
          })
        }
      }
    }

    await createItems<DailyWork[]>({
      collection: "daily_work",
      items: [{ ...daily_work, date: formatDateNoneToIosString(daily_work.date!) }],
    })

    router.back()
  } catch (e) {
    $q.notify({
      color: "red",
      message: "une erreur est survenu. \nrechargez la page et recommencez",
    })
  }
}
</script>

<template>
  {{ data }}
  <div>
    <top-bar>
      <template v-slot:right>
        <q-btn rounded icon="done" type="submit" color="green" @click="onSave" />
      </template>
    </top-bar>
    <q-form autofocus>
      <div class="space-y-5 w-80">
        <q-input outlined dense type="date" label="Date" v-model="daily_work.date" />
        <q-input
          outlined
          dense
          type="number"
          label="Quantité utilisé (kg)"
          v-model="daily_work.used_quantity"
        />

        <q-input
          outlined
          dense
          type="number"
          label="Quantité trié (kg)"
          v-model="daily_work.sorted_quantity"
        />

        <q-input
          outlined
          dense
          type="number"
          label="Quantité epluché (kg)"
          v-model="daily_work.peeled_quantity"
        />

        <q-input
          outlined
          dense
          type="number"
          label="Quantité séché (kg)"
          v-model="daily_work.dried_quantity"
        />
      </div>
    </q-form>
  </div>
</template>
