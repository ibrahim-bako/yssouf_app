<script setup lang="ts">
import { DirectusQueryParams } from "nuxt-directus/dist/runtime/types"
import { components } from "~/interfaces/nuxtus"
type Staff = components["schemas"]["ItemsStaff"]
type Presence = components["schemas"]["ItemsPresence"]

definePageMeta({
  middleware: ["auth"],
})

const { params } = useRoute()
const { getItems, getItemById, updateItem } = useDirectusItems()

const $q = useQuasar()

const dateLimits = reactive<{ min: string | null; max: string | null }>({
  min: null,
  max: null,
})

const is_edit = ref<boolean>(false)
const edit_staff = ref<Staff | null>(null)

const { data: staff, refresh: refreshStaff } = useAsyncData(async () => {
  return await getItemById<Staff>({
    collection: "staff",
    id: params.id as string,
  })
})

const updateStaff = async () => {
  try {
    await updateItem({
      collection: "staff",
      id: staff.value!.id!.toString(),
      item: {
        first_name: staff.value?.first_name,
        last_name: staff.value?.last_name,
        tel: staff.value?.tel,
        birthday: staff.value?.birthday,
        card_number: staff.value?.card_number,
        sex: staff.value?.sex,
        emergency_person: staff.value?.emergency_person,
        emergency_tel: staff.value?.emergency_tel,
        occupation: staff.value?.occupation,
      } as Staff,
    })
  } catch (e) {
    $q.notify({
      color: "red",
      message: "modification echouer",
    })
  } finally {
    await refreshStaff()
    is_edit.value = false
  }
}

const { data: presences } = useAsyncData(
  async () => {
    return await getItems<Presence[]>({
      collection: "presence",
      params: {
        filter: {
          staff: params.id,
          date:
            dateLimits.min && dateLimits.max
              ? {
                  _between: [
                    formatDateNoneToIosString(dateLimits.min),
                    formatDateNoneToIosString(dateLimits.max),
                  ],
                }
              : undefined,
        },
        limit: -1,
        sort: "-date",
      },
    })
  },
  { lazy: true, server: true, immediate: true, watch: [dateLimits] }
)

const table = reactive({
  rows: presences.value,
  columns: [
    {
      name: "date",
      label: "DATE",
      field: "date",
      sortable: true,
      format: (val: string) => useDateFormat(val, "DD-MM-YYYY").value,
    },
    { name: "one", label: "Apell 1", field: "one", sortable: false },
    { name: "two", label: "Apell 2", field: "two", sortable: false },
    { name: "three", label: "Apell 3", field: "one", sortable: false },
  ],
})

watchEffect(() => {
  table.rows = presences.value! || []
})
</script>
<template>
  <div>
    <top-bar>
      <template v-slot:right>
        <q-btn
          icon="edit"
          label="modifier"
          color="grey"
          v-if="!is_edit"
          @click="is_edit = !is_edit"
        />
        <q-btn icon="done" label="save" color="green" v-if="is_edit" @click="updateStaff()" />
      </template>
    </top-bar>
    <div>
      <q-form v-if="staff" class="space-y-5 ml-20">
        <div class="grid grid-cols-3 gap-4 w-[60vw]">
          <q-input
            outlined
            dense
            :disable="!is_edit"
            type="text"
            label="Nom *"
            v-model="staff.last_name"
          />
          <q-input
            outlined
            dense
            :disable="!is_edit"
            type="text"
            label="Prénom *"
            v-model="staff.first_name"
          />
          <q-input
            outlined
            dense
            :disable="!is_edit"
            type="text"
            label="Téléphone *"
            v-model="staff.tel"
          />
          <q-input
            outlined
            dense
            :disable="!is_edit"
            type="date"
            label="Date de naissance"
            v-model="staff.birthday"
          />

          <q-select
            outlined
            dense
            :disable="!is_edit"
            label="sex *"
            :options="['man', 'woman']"
            :option-label="(opt: string) => opt==='man'? 'Homme' : 'Femme' "
            v-model="staff.sex"
          />
          <q-input
            outlined
            dense
            :disable="!is_edit"
            type="text"
            label="CNIB *"
            v-model="staff.card_number"
          />

          <q-input
            outlined
            dense
            :disable="!is_edit"
            type="text"
            label="Profession *"
            v-model="staff.occupation"
          />
          <q-input
            outlined
            dense
            :disable="!is_edit"
            type="text"
            label="Contact en cas d'urgence *"
            v-model="staff.emergency_person"
          />
          <q-input
            outlined
            dense
            :disable="!is_edit"
            type="text"
            label="Numeros en cas d'urgence *"
            v-model="staff.emergency_tel"
          />
        </div>
        <div class="grid grid-cols-2 gap-4 w-[700px]"></div>
      </q-form>
      <br />
      <br />
      <q-table
        title="Liste de Presence"
        :rows="table.rows"
        :columns="table.columns"
        :rows-per-page-options="[0]"
        flat
        class="h-[50vh]"
        virtual-scroll
        hide-pagination
        dense
        row-key="id"
        hide-bottom
      >
        <template v-slot:top-right>
          <div class="flex space-x-4">
            <q-input type="date" label="min date" dense outlined v-model="dateLimits.min" />
            <q-input type="date" label="max date" dense outlined v-model="dateLimits.max" />
          </div>
        </template>

        <template v-slot:body-cell-one="props">
          <q-td :props="props">
            <div>
              <q-checkbox v-model="props.value" disable />
            </div>
          </q-td>
        </template>

        <template v-slot:body-cell-two="props">
          <q-td :props="props">
            <div>
              <q-checkbox v-model="props.value" disable />
            </div>
          </q-td>
        </template>

        <template v-slot:body-cell-three="props">
          <q-td :props="props">
            <div>
              <q-checkbox v-model="props.value" disable />
            </div>
          </q-td>
        </template>
      </q-table>
    </div>
  </div>
</template>
