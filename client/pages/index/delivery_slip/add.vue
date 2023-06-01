<script setup lang="ts">
import { components } from "~/interfaces/nuxtus"
type DeliverySlip = components["schemas"]["ItemsDeliverySlip"]
type Provider = components["schemas"]["ItemsProvider"]
type Product = components["schemas"]["ItemsProduct"]

definePageMeta({
  middleware: ["auth"],
})

import validator from "validator"

const router = useRouter()
const $q = useQuasar()

const { params, query } = useRoute()

const { getItems, createItems, getItemById } = useDirectusItems()

const delivery_slip = ref<DeliverySlip>({ date: "" })
const products = ref<Product[]>([{ designation: "", type: "", quantity: 0, weigth: 0 }])

const provider = ref<Provider>({})

const { data: default_provider } = useAsyncData(
  async () => {
    return getItemById<Provider>({
      collection: "provider",
      id: query.provider_id?.toString(),
    })
  },
  {
    lazy: true,
    server: true,
    immediate: true,
  }
)

watchEffect(() => {
  if (default_provider) {
    provider.value = default_provider.value!
  }
})

const { data: providers } = useAsyncData(
  async () => {
    return await getItems<Provider>({
      collection: "provider",
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
      !delivery_slip.value.date ||
      validator.isEmpty(delivery_slip.value.date) ||
      !validator.isDate(delivery_slip.value.date)
    ) {
      return $q.notify({
        color: "red",
        message: "le champs date est invalide",
      })
    }

    if (!provider.value.id || validator.isEmpty(provider.value.id?.toString()!)) {
      return $q.notify({
        color: "red",
        message: "le champs fournisseur est invalide",
      })
    }

    for (let product of products.value) {
      console.log(product)
      for (const [key, value] of Object.entries(product)) {
        console.log(`${key}: ${value}`)
        if (!value || validator.isEmpty(value as any) || value === " ") {
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

    const new_delivery_slip = await createItems<DeliverySlip>({
      collection: "delivery_slip",
      items: [{ ...delivery_slip.value, provider: provider.value?.id }],
    })

    await createItems<Product>({
      collection: "product",
      items: products.value.map((product) => ({
        ...product,
        delivery_slip: new_delivery_slip[0].id,
      })),
    })

    router.back()
  } catch (e) {
    $q.notify({
      color: "red",
      message: "une erreur est survenu. \nrechargez la page et recommencez",
    })
  }
}

// const save = async () => {
//   try {
//     await createDeliverySlip()

//     if (create_delivery_slip_error.value) {
//       throw new Error(create_delivery_slip_error.value.message)
//     }

//     await createDeliverySlipProducts()

//     if (create_delivery_slip_products_error.value) {
//       throw new Error(create_delivery_slip_products_error.value.message)
//     }

//     $q.notify({
//       color: "green",
//       message: "succes",
//     })

//     await router.back()
//   } catch (e: any) {
//     $q.notify({
//       color: "red",
//       message: e.message,
//     })
//   }
// }
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
            v-if="providers"
            v-model="provider"
            :options="providers"
            class="w-40"
            label="Fournisseur"
            dense
            outlined
            :option-label="(opt: Provider) => opt.name"
          >
          </q-select>
          <q-input outlined dense v-model="delivery_slip.date" type="date" label="date" />
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
