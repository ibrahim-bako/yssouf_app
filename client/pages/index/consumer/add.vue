<script setup lang="ts">
import { components } from "~/interfaces/nuxtus"
import validator from "validator"
type Consumer = components["schemas"]["ItemsConsumer"]

definePageMeta({
  middleware: ["auth"],
})

const $q = useQuasar()
const { createItems } = useDirectusItems()
const router = useRouter()

const consumer = reactive<Consumer>({ name: "", tel: "", ifu: "", rccm: "" })
watchEffect(() => {
  consumer.ifu = consumer.ifu?.toUpperCase()
  consumer.rccm = consumer.rccm?.toUpperCase()
})

const onSave = async () => {
  try {
    for (const [key, value] of Object.entries(consumer)) {
      if (!value || validator.isEmpty(value.toString()) || value === " ") {
        return $q.notify({
          color: "red",
          message: `le champ "${key}" est obligatoire`,
        })
      }
    }
    await createItems({
      collection: "consumer",
      items: [consumer],
    })

    router.back()
  } catch (e) {
    return $q.notify({
      color: "red",
      message: `une erreur est survenu. rechargez la page et recommencez`,
    })
  }
}
</script>

<template>
  <div>
    <top-bar>
      <template v-slot:right>
        <q-btn rounded icon="done" type="submit" color="green" label="Save" @click="onSave" />
      </template>
    </top-bar>
    <q-form class="ml-20">
      <div class="w-80 space-y-5">
        <q-input outlined dense type="text" label="Name *" v-model="consumer.name" />
        <q-input outlined dense type="text" label="Téléphone *" v-model="consumer.tel" />
        <q-input outlined dense type="text" label="RCCM *" v-model="consumer.rccm" />
        <q-input outlined dense type="text" label="IFU *" v-model="consumer.ifu" />
      </div>
    </q-form>
  </div>
</template>
