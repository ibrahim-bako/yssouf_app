<script setup lang="ts">
import { DirectusQueryParams } from "nuxt-directus/dist/runtime/types"
import { components } from "~/interfaces/nuxtus"
type Provider = components["schemas"]["ItemsProvider"]
type PurshaseOrder = components["schemas"]["ItemsPurshaseOrder"]
type DeliverySlip = components["schemas"]["ItemsDeliverySlip"]

definePageMeta({
  middleware: ["auth"],
})

const { getItemById, getItems, deleteItems } = useDirectusItems()
const { params } = useRoute()

const $q = useQuasar()

const selected_purshase_orders = ref<PurshaseOrder[]>([])
const selected_delivery_slips = ref<DeliverySlip[]>([])

const { data: provider } = useAsyncData(
  async () => {
    return await getItemById<Provider>({
      collection: "provider",
      id: params.id as string,
    })
  },
  { lazy: true, server: true, immediate: true }
)

const { data: purshase_orders, refresh: refreshPurshaseOrders } = useAsyncData(
  async () => {
    return await getItems<PurshaseOrder>({
      collection: "purshase_order",
      params: {
        limit: -1,
        filter: {
          provider: params.id,
        },
        sort: ["-date", "-id"],
      },
    })
  },
  { lazy: true, server: true, immediate: true }
)

const { data: delivery_slips, refresh: refreshDeliverySlip } = useAsyncData(
  async () => {
    return await getItems<DeliverySlip>({
      collection: "delivery_slip",
      params: {
        limit: -1,
        filter: {
          provider: params.id,
        },
        sort: ["-date", "-id"],
      },
    })
  },
  { lazy: true, server: true, immediate: true }
)

const deletePurshaseOrder = async () => {
  $q.dialog({
    title: "Attention",
    message: "Vouler vous supprimer les élément sélectinné ?",
    cancel: true,
    persistent: true,
  }).onOk(async () => {
    try {
      await deleteItems({
        collection: "purshase_order",
        items: selected_purshase_orders.value.map((purshase) => purshase.id!.toString() as string),
      })
      await refreshPurshaseOrders()
    } catch (e) {
      $q.notify({
        color: "red",
        message: "erreur de suppression. vous ne pouver pas effectuer cette action",
      })
    }
  })
}

const deleteDeliverySlip = async () => {
  $q.dialog({
    title: "Attention",
    message: "Vouler vous supprimer les élément sélectinné ?",
    cancel: true,
    persistent: true,
  }).onOk(async () => {
    try {
      await deleteItems({
        collection: "delivery_slip",
        items: selected_delivery_slips.value.map((slip) => slip.id!.toString() as string),
      })
      await refreshDeliverySlip()
    } catch (e) {
      $q.notify({
        color: "red",
        message: "erreur de suppression. vous ne pouver pas effectuer cette action",
      })
    }
  })
}

const createPurshaseOrder = () => {
  navigateTo({
    path: "/purshase_order/add",
    query: {
      provider_id: provider.value?.id,
    },
  })
}

const createDeliverySlip = () => {
  navigateTo({
    path: "/delivery_slip/add",
    query: {
      provider_id: provider.value?.id,
    },
  })
}

const onClickItemPurshase = (event: Event, row: PurshaseOrder, index: number) => {
  navigateTo("/purshase_order/" + row.id)
}

const onClickItemSlip = (event: Event, row: DeliverySlip, index: number) => {
  navigateTo("/delivery_slip/" + row.id)
}
</script>

<template>
  <top-bar></top-bar>
  <div v-if="provider && purshase_orders && delivery_slips">
    <div class="">
      <div class="flex space-x-5">
        <q-input type="text" label="Nom" readonly outlined dense v-model="provider.name" />
        <q-input type="text" label="Téléphone" readonly outlined dense v-model="provider.tel" />
        <q-input type="text" label="IFU" readonly outlined dense v-model="provider.ifu" />
        <q-input type="text" label="RCCM" readonly outlined dense v-model="provider.rccm" />
      </div>
      <br />
      <div class="flex w-full justify-around">
        <q-table
          @row-click="onClickItemPurshase"
          title="Bon de commande"
          class="h-[65vh] w-[48%]"
          virtual-scroll
          hide-pagination
          :rows-per-page-options="[0]"
          flat
          bordered
          selection="multiple"
          v-model:selected="selected_purshase_orders"
          :columns="[
            {
              name: 'id',
              label: 'ID',
              field: 'id',
              format: (val: string) => padInvoiceNumber(parseInt(val)),
            },
            {
              name: 'date',
              label: 'DATE',
              field: 'date',
              format: (val: string) => useDateFormat(val, 'DD/MM/YYYY').value,
            },
            {
              name: 'number',
              label: 'Nombre de produits',
              field: 'products',
              format: (val: []) => val.length,
            },
          ]"
          :rows="purshase_orders"
          row-key="id"
        >
          <template v-slot:top-right>
            <div class="space-x-5">
              <q-btn icon="delete" outline color="red" dense @click="deletePurshaseOrder" />
              <q-btn
                icon="add"
                label="Ajouter un bon"
                color="green"
                dense
                @click="createPurshaseOrder"
              />
            </div>
          </template>
        </q-table>

        <q-table
          @row-click="onClickItemSlip"
          title="Bordereau de livraison"
          class="h-[65vh] w-[48%]"
          virtual-scroll
          :rows-per-page-options="[0]"
          hide-pagination
          flat
          bordered
          selection="multiple"
          v-model:selected="selected_delivery_slips"
          :columns="[
            {
              name: 'id',
              label: 'ID',
              field: 'id',
              format: (val: string) => padInvoiceNumber(parseInt(val)),
            },
            {
              name: 'date',
              label: 'DATE',
              field: 'date',
              format: (val: string) => useDateFormat(val, 'DD/MM/YYYY').value,
            },
            {
              name: 'number',
              label: 'Nombre de produits',
              field: 'products',
              format: (val: []) => val.length,
            },
          ]"
          :rows="delivery_slips"
          row-key="id"
        >
          <template v-slot:top-right>
            <div class="space-x-5">
              <q-btn icon="delete" outline color="red" dense @click="deleteDeliverySlip" />
              <q-btn
                icon="add"
                label="Ajouter un bordereau"
                color="green"
                dense
                @click="createDeliverySlip"
              />
            </div>
          </template>
        </q-table>
      </div>
    </div>
  </div>
</template>
