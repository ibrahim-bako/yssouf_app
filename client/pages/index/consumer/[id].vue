<script setup lang="ts">
import { DirectusQueryParams } from "nuxt-directus/dist/runtime/types"
import { components } from "~/interfaces/nuxtus"
type Consumer = components["schemas"]["ItemsConsumer"]
type SellInvoice = components["schemas"]["ItemsSellInvoice"]
type DeliveryNote = components["schemas"]["ItemsDeliveryNote"]

definePageMeta({
  middleware: ["auth"],
})

const { getItemById, getItems, deleteItems } = useDirectusItems()
const { params } = useRoute()

const $q = useQuasar()

const selected_sell_invoices = ref<SellInvoice[]>([])
const selected_delivery_notes = ref<DeliveryNote[]>([])

const { data: consumer } = useAsyncData(
  async () => {
    return await getItemById<Consumer>({
      collection: "consumer",
      id: params.id as string,
    })
  },
  { lazy: true, server: true, immediate: true }
)

const { data: sell_invoices, refresh: refreshSellInvoices } = useAsyncData(
  async () => {
    return await getItems<SellInvoice[]>({
      collection: "sell_invoice",
      params: {
        limit: -1,
        filter: {
          consumer: params.id,
        },
        sort: ["-date", "-id"],
      },
    })
  },
  { lazy: true, server: true, immediate: true }
)

const { data: delivery_notes, refresh: refreshDeliveryNotes } = useAsyncData(
  async () => {
    return await getItems<DeliveryNote[]>({
      collection: "delivery_note",
      params: {
        limit: -1,
        filter: {
          consumer: params.id,
        },
        sort: ["-date", "-id"],
      },
    })
  },
  { lazy: true, server: true, immediate: true }
)

const deleteSellInvoice = async () => {
  $q.dialog({
    title: "Attention",
    message: "Vouler vous supprimer les élément sélectinné ?",
    cancel: true,
    persistent: true,
  }).onOk(async () => {
    try {
      await deleteItems({
        collection: "sell_invoice",
        items: selected_sell_invoices.value.map((invoice) => invoice.id!.toString() as string),
      })
      await refreshSellInvoices()

      selected_sell_invoices.value = []
    } catch (e) {
      $q.notify({
        color: "red",
        message: "erreur de suppression. vous ne pouver pas effectuer cette action",
      })
    }
  })
}

const deleteDeliveryNote = () => {
  $q.dialog({
    title: "Attention",
    message: "Vouler vous supprimer les élément sélectinné ?",
    cancel: true,
    persistent: true,
  }).onOk(async () => {
    try {
      await deleteItems({
        collection: "delivery_note",
        items: selected_delivery_notes.value.map((note) => note.id!.toString() as string),
      })
      await refreshDeliveryNotes()

      selected_delivery_notes.value = []
    } catch (e) {
      $q.notify({
        color: "red",
        message: "erreur de suppression. vous ne pouver pas effectuer cette action",
      })
    }
  })
}

const createSellInvoice = () => {
  navigateTo({
    path: "/sell_invoice/add",
    query: {
      consumer_id: consumer.value?.id,
    },
  })
}

const createDeliveryNote = () => {
  navigateTo({
    path: "/delivery_note/add",
    query: {
      consumer_id: consumer.value?.id,
    },
  })
}

const onClickItemSellInvoice = (event: Event, row: SellInvoice, index: number) => {
  navigateTo("/sell_invoice/" + row.id)
}

const onClickItemDeliveryNote = (event: Event, row: DeliveryNote, index: number) => {
  navigateTo("/delivery_note/" + row.id)
}
</script>

<template>
  <top-bar></top-bar>
  <div v-if="consumer && sell_invoices && delivery_notes">
    <div class="">
      <div class="flex space-x-5">
        <q-input type="text" label="Nom" readonly outlined dense v-model="consumer.name" />
        <q-input type="text" label="Téléphone" readonly outlined dense v-model="consumer.tel" />
        <q-input type="text" label="IFU" readonly outlined dense v-model="consumer.ifu" />
        <q-input type="text" label="RCCM" readonly outlined dense v-model="consumer.rccm" />
      </div>
      <br />
      <div class="flex w-full justify-around">
        <q-table
          @row-click="onClickItemSellInvoice"
          title="Facture de vente"
          flat
          bordered
          class="h-[65vh] w-[48%]"
          virtual-scroll
          hide-pagination
          :rows-per-page-options="[0]"
          selection="multiple"
          v-model:selected="selected_sell_invoices"
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
          :rows="sell_invoices"
          row-key="id"
        >
          <template v-slot:top-right>
            <div class="space-x-5">
              <q-btn icon="delete" outline color="red" dense @click="deleteSellInvoice" />
              <q-btn
                icon="add"
                label="Ajouter un bon"
                color="green"
                dense
                @click="createSellInvoice"
              />
            </div>
          </template>
        </q-table>

        <q-table
          @row-click="onClickItemDeliveryNote"
          title="Bon de livraison"
          class="h-[65vh] w-[48%]"
          virtual-scroll
          hide-pagination
          flat
          :rows-per-page-options="[0]"
          bordered
          selection="multiple"
          v-model:selected="selected_delivery_notes"
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
          :rows="delivery_notes"
          row-key="id"
        >
          <template v-slot:top-right>
            <div class="space-x-5">
              <q-btn icon="delete" outline color="red" dense @click="deleteDeliveryNote" />
              <q-btn
                icon="add"
                label="Ajouter un bordereau"
                color="green"
                @click="createDeliveryNote"
              />
            </div>
          </template>
        </q-table>
      </div>
    </div>
  </div>
</template>
