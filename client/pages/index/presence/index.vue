<script setup lang="ts">
import { components } from "~/interfaces/nuxtus"
definePageMeta({
  middleware: ["auth"],
})

type Staff = components["schemas"]["ItemsStaff"]
type _Presence = components["schemas"]["ItemsPresence"]

type Presence = _Presence & { staff: Staff }

const $q = useQuasar()

const { getItems, updateItem, createItems } = useDirectusItems()

const today = computed(() => {
  return useDateFormat(Date.now(), "YYYY-MM-DD").value
})

const selected_presences = ref<Presence[]>([])

const getPresenceDate = ref<string>(today.value)

const [dialogOpen, toggleDialog] = useToggle()
const createPresencedate = ref<string>(today.value)

const { data: presences, refresh } = useAsyncData(
  async () => {
    return await getItems<Presence>({
      collection: "presence",
      params: {
        limit: -1,
        fields: ["*", "staff.*"],
        filter: {
          date: formatDateNoneToIosString(getPresenceDate.value),
        },
      },
    })
  },
  { lazy: true, server: false, immediate: true, watch: [getPresenceDate] }
)

const onCreatePresences = async () => {
  try {
    const staffs = await getItems<Staff>({
      collection: "staff",
      params: {
        filter: {
          active: true,
        },
      },
    })

    const existed_staffs_presence = await getItems<Staff>({
      collection: "staff",
      params: {
        filter: {
          active: true,
          presences: { date: formatDateNoneToIosString(createPresencedate.value) },
        },
      },
    })

    const safe_staffs = staffs.filter((staff) => {
      for (let stp of existed_staffs_presence) {
        if (stp.id === staff.id) {
          return false
        }
      }
      return true
    })

    const new_presences = safe_staffs.map(
      (staff) =>
        ({ staff: staff.id, date: formatDateNoneToIosString(createPresencedate.value) } as Presence)
    )

    await createItems<Presence>({
      collection: "presence",
      items: new_presences,
    })

    refresh()
  } catch (e) {
    $q.notify({
      color: "red",
      message: "une erreur est survenu. rechargez la page et recommencez",
    })
  }
}

const onUpdateOne = async (presence: Presence) => {
  await updateItem({
    collection: "presence",
    id: presence.id!.toString(),
    item: {
      one: presence.one,
      two: presence.two,
      three: presence.three,
    },
  })

  refresh()
}

const table = reactive({
  rows: presences.value || [],
  columns: [
    // {
    //   name: "id",
    //   label: "ID",
    //   field: "id",
    //   format: (val: string) => parseInt(val),
    // },
    {
      name: "last_name",
      label: "Nom",
      format: (raw: any, presence: Presence) => presence.staff.last_name,
    },
    {
      name: "first_name",
      label: "Prénom",
      field: "first_name",
      format: (raw: any, presence: Presence) => presence.staff.first_name,
    },
    {
      name: "one",
      label: "matin",
      field: "one",
      // classes: (raw: boolean) => (raw ? "text-green-600" : "text-red-600") + " font-bold",
      format: (raw: boolean) => (raw ? "present" : "abscent"),
    },
    {
      name: "two",
      label: "midi",
      field: "two",
      format: (raw: boolean) => (raw ? "present" : "abscent"),
    },
    {
      name: "three",
      label: "soir",
      field: "three",
      format: (raw: boolean) => (raw ? "present" : "abscent"),
    },
  ],
})

watchEffect(() => {
  table.rows = presences.value!
})

const setOne = async () => {
  try {
    selected_presences.value.map((presence) => {
      updateItem({
        collection: "presence",
        id: presence.id?.toString()!,
        item: { one: true },
      })
    })
    refresh()
  } catch (e) {
    $q.notify({
      color: "red",
      message: "erreur serveur. rechargez la page",
    })
  }
}

const setTwo = async () => {
  try {
    selected_presences.value.map((presence) => {
      updateItem({
        collection: "presence",
        id: presence.id?.toString()!,
        item: { two: true },
      })
    })
    refresh()
  } catch (e) {
    $q.notify({
      color: "red",
      message: "erreur serveur. rechargez la page",
    })
  }
}

const setThree = async () => {
  try {
    selected_presences.value.map((presence) => {
      updateItem({
        collection: "presence",
        id: presence.id?.toString()!,
        item: { three: true },
      })
    })
    refresh()
  } catch (e) {
    $q.notify({
      color: "red",
      message: "erreur serveur. rechargez la page",
    })
  }
}
</script>
<template>
  <q-dialog v-model="dialogOpen" persistent>
    <q-card style="min-width: 350px">
      <q-card-section>
        <div class="text-h6">Date</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <q-input dense type="date" v-model="createPresencedate" autofocus />
      </q-card-section>

      <q-card-actions align="right" class="text-primary">
        <q-btn flat label="Retour" v-close-popup @click="toggleDialog()" />
        <q-btn flat label="Créer" v-close-popup @click="onCreatePresences" />
      </q-card-actions>
    </q-card>
  </q-dialog>
  <div>
    <top-bar>
      <template v-slot:right>
        <div class="mx-10 flex space-x-5">
          <q-btn label="matin" color="cyan" @click="setOne" />
          <q-btn label="midi" color="cyan" @click="setTwo" />
          <q-btn label="soir" color="cyan" @click="setThree" />
        </div>
        <div class="space-x-4 flex">
          <q-input
            v-model="getPresenceDate"
            outlined
            dense
            type="date"
            label="date de presence "
            placeholder="date de presence"
          />
          <q-btn label="ajouter" @click="toggleDialog()" />
        </div>
      </template>
    </top-bar>
    <div>
      <div>
        <q-table
          v-if="table.rows"
          @row-click="onClickItemSellInvoice"
          flat
          bordered
          virtual-scroll
          class="w-[60%]"
          hide-pagination
          :rows-per-page-options="[0]"
          selection="multiple"
          v-model:selected="selected_presences"
          :columns="table.columns"
          :rows="table.rows"
          row-key="id"
        />
      </div>
      <!-- <q-list bordered separator>
        <q-item clickable v-ripple>
          <q-item-section>
            <q-item-label class="text-xl font-medium">Nom</q-item-label>
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-xl font-medium">Prénom</q-item-label>
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-xl font-medium">premier apell</q-item-label>
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-xl font-medium">second apell</q-item-label>
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-xl font-medium">dernier apell</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable v-ripple v-for="presence in presences">
          <q-item-section>
            <q-item-label>{{ presence.staff.first_name }}</q-item-label>
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ presence.staff.last_name }}</q-item-label>
          </q-item-section>
          <q-item-section>
            <q-checkbox dense disable v-model="presence.one" />
          </q-item-section>
          <q-item-section>
            <q-checkbox dense disable v-model="presence.two" />
          </q-item-section>
          <q-item-section>
            <q-checkbox dense disable v-model="presence.three" />
          </q-item-section>
        </q-item>
      </q-list> -->
    </div>
  </div>
</template>
