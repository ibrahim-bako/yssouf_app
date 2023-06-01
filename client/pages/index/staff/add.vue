<script setup lang="ts">
import { components } from "~/interfaces/nuxtus"
type Staff = components["schemas"]["ItemsStaff"]

definePageMeta({
  middleware: ["auth"],
})

import validator from "validator"

const $q = useQuasar()

const { getItems, createItems } = useDirectusItems()
const router = useRouter()

const staff = reactive<Staff>({ first_name: "", last_name: "", sex: "woman", occupation: "" })
watchEffect(() => {
  staff.card_number = staff.card_number?.toUpperCase()
})

const onSave = async () => {
  try {
    for (const [key, value] of Object.entries(staff)) {
      console.log(`${key}: ${value}`)
      if (!value || validator.isEmpty(value as any) || value === " ") {
        return $q.notify({
          color: "red",
          message: "tous les champs sont obligatoir",
        })
      }

      if (key === "card_number") {
        console.log(value.toString()[0])

        if ("B" !== value.toString()[0]) {
          return $q.notify({
            color: "red",
            message: "la cnib doit comporté 'B'",
          })
        }
      }
    }

    await createItems<Staff>({
      collection: "staff",
      items: [staff],
    })

    router.back()
  } catch (e) {
    return $q.notify({
      color: "red",
      multiLine: true,
      message: "une erreur est survenu. \nrechargez la page et recommencez",
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
    <q-form class="space-y-5">
      <div class="grid grid-cols-2 gap-4 w-[700px] ml-20">
        <q-input outlined dense type="text" label="Nom *" v-model="staff.last_name" />
        <q-input outlined dense type="text" label="Prénom *" v-model="staff.first_name" />
        <q-input outlined dense type="text" label="Téléphone *" v-model="staff.tel" />
        <q-input outlined dense type="date" label="Date de naissance" v-model="staff.birthday" />

        <q-select
          outlined
          dense
          label="sex *"
          :options="['man', 'woman']"
          :option-label="(opt: string) => opt==='man'? 'Homme' : 'Femme' "
          v-model="staff.sex"
        />
        <q-input outlined dense type="text" label="CNIB *" v-model="staff.card_number" />

        <q-input outlined dense type="text" label="Profession *" v-model="staff.occupation" />
      </div>
      <div class="grid grid-cols-2 gap-4 w-[700px] ml-20">
        <q-input
          outlined
          dense
          type="text"
          label="Contact en cas d'urgence *"
          v-model="staff.emergency_person"
        />
        <q-input
          outlined
          dense
          type="text"
          label="Numeros en cas d'urgence *"
          v-model="staff.emergency_tel"
        />
      </div>
    </q-form>
  </div>
</template>
