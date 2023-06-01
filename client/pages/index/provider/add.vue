<script setup lang="ts">
import { components } from "~/interfaces/nuxtus"
import validator from "validator"
type Provider = components["schemas"]["ItemsProvider"]

definePageMeta({
  middleware: ["auth"],
})

const { createItems } = useDirectusItems()
const router = useRouter()

const $q = useQuasar()

const provider = reactive<Provider>({ name: "", tel: "", ifu: "", rccm: "" })
watchEffect(() => {
  provider.ifu = provider.ifu?.toUpperCase()
  provider.rccm = provider.rccm?.toUpperCase()
})

const { data, error, execute } = useAsyncData(
  async () => {
    return await createItems<Provider[]>({
      collection: "provider",
      items: [provider],
    })
  },
  {
    lazy: true,
    server: true,
    immediate: false,
  }
)

const onSave = async () => {
  try {
    for (const [key, value] of Object.entries(provider)) {
      if (!value || validator.isEmpty(value.toString()) || value === " ") {
        return $q.notify({
          color: "red",
          message: `le champ "${key}" est obligatoire`,
        })
      }
    }

    await createItems({
      collection: "provider",
      items: [provider],
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
        <q-btn rounded icon="done" type="submit" color="green" @click="onSave" />
      </template>
    </top-bar>
    <div class="ml-20">
      <q-form autofocus>
        <div class="w-80 space-y-5">
          <q-input class="w-80" outlined dense type="text" label="Name *" v-model="provider.name" />
          <q-input
            class="w-80"
            outlined
            dense
            type="text"
            label="Téléphone *"
            v-model="provider.tel"
          />
          <q-input class="w-80" outlined dense type="text" label="RCCM *" v-model="provider.rccm" />
          <q-input class="w-80" outlined dense type="text" label="IFU *" v-model="provider.ifu" />
        </div>
      </q-form>
    </div>
  </div>
</template>
