<script setup lang="ts">
import { components } from "~/interfaces/nuxtus"
type DeliveryNote = components["schemas"]["ItemsDeliveryNote"]
type Consumer = components["schemas"]["ItemsConsumer"]
type Product = components["schemas"]["ItemsProduct"]

definePageMeta({
  middleware: ["auth"],
})

import validator from "validator"

const router = useRouter()
const $q = useQuasar()

const { params, query } = useRoute()

const { getItems, createItems, getItemById } = useDirectusItems()

const delivery_note = ref<DeliveryNote>({ date: "" })
const products = ref<Product[]>([{ designation: "", type: "", quantity: 0, weigth: 0 }])

const consumer = ref<Consumer>({})

const { data: default_consumer } = useAsyncData(
  async () => {
    return getItemById<Consumer>({
      collection: "consumer",
      id: query.consumer_id?.toString(),
    })
  },
  {
    lazy: true,
    server: true,
    immediate: true,
  }
)

watchEffect(() => {
  if (default_consumer) {
    consumer.value = default_consumer.value!
  }
})

const { data: consumers } = useAsyncData(
  async () => {
    return await getItems<Consumer>({
      collection: "consumer",
    })
  },
  {
    lazy: true,
    server: true,
    immediate: true,
  }
)

const addProduct = () => {
  products.value.push({
    designation: "",
    type: "",
    quantity: 0,
    weigth: 0,
  })
}

const popProduct = (_index: number) => {
  products.value = products.value.filter((product, index) => index != _index)
}

const save = async () => {
  try {
    if (
      !delivery_note.value.date ||
      validator.isEmpty(delivery_note.value.date) ||
      !validator.isDate(delivery_note.value.date)
    ) {
      return $q.notify({
        color: "red",
        message: "le champs date est invalide",
      })
    }

    if (!consumer.value.id || validator.isEmpty(consumer.value.id?.toString()!)) {
      return $q.notify({
        color: "red",
        message: "le champs client est invalide",
      })
    }

    for (let product of products.value) {
      for (const [key, value] of Object.entries(product)) {
        if (!value || validator.isEmpty(value.toString()) || value === " ") {
          return $q.notify({
            color: "red",
            message: "les champs produit sont obligatoire",
          })
        }

        if (key === "quantity") {
          if (!validator.isNumeric(value.toString())) {
            return $q.notify({
              color: "red",
              message: "quantité doit être un nombre",
            })
          }
        }

        if (key === "weight") {
          if (!validator.isNumeric(value.toString())) {
            return $q.notify({
              color: "red",
              message: "poids doit être un nombre",
            })
          }
        }
      }
    }

    const new_delivery_note = await createItems<DeliveryNote>({
      collection: "delivery_note",
      items: [{ ...delivery_note.value, consumer: consumer.value?.id }],
    })

    await createItems<Product>({
      collection: "product",
      items: products.value.map((product) => ({
        ...product,
        delivery_note: new_delivery_note[0].id,
      })),
    })

    router.back()
  } catch (e) {
    $q.notify({
      color: "red",
      message: "une erreur est survenu. rechargez la page et recommencez",
    })
  }
}
</script>
<template>
  <div>
    <top-bar>
      <template v-slot:right>
        <q-btn @click="save" icon="done" title="save" rounded color="green" />
      </template>
    </top-bar>
    <div class="">
      <div class="space-y-5">
        <div class="flex space-x-5">
          <q-select
            v-if="consumers"
            v-model="consumer"
            :options="consumers"
            class="w-40"
            label="Client"
            dense
            outlined
            :option-label="(opt: Consumer) => opt.name"
          >
          </q-select>
          <q-input outlined dense v-model="delivery_note.date" type="date" label="date" />
        </div>
      </div>
      <div style="margin-top: 30px">
        <p class="text-2xl">List des biens</p>
        <q-list separator>
          <q-item>
            <q-item-section>Désignation</q-item-section>
            <q-item-section>Nature</q-item-section>
            <q-item-section>Quantité</q-item-section>
            <q-item-section>Poids(kg)</q-item-section>
            <q-item-section>action</q-item-section>
          </q-item>
          <q-item v-for="(product, index) in products">
            <q-item-section>
              <q-input
                v-model="product.designation"
                outlined
                dense
                placeholder="désignation"
                type="textarea"
                autogrow
              />
            </q-item-section>
            <q-item-section>
              <q-input v-model="product.type" outlined dense type="text" placeholder="nature" />
            </q-item-section>
            <q-item-section>
              <q-input
                v-model="product.quantity"
                outlined
                dense
                type="number"
                placeholder="quantité"
              />
            </q-item-section>
            <q-item-section>
              <q-input v-model="product.weigth" outlined dense type="number" placeholder="poids" />
            </q-item-section>
            <q-item-section>
              <q-btn icon="delete" color="red" class="w-10" outline @click="popProduct(index)" />
            </q-item-section>
          </q-item>
        </q-list>
        <q-btn @click="addProduct" icon="add" title="AJOUTER" dense color="green" />
      </div>
    </div>
  </div>
</template>
