<script setup lang="ts">
import { components } from "~/interfaces/nuxtus"
type Settings = components["schemas"]["ItemsSettings"]

const { getSingletonItem } = useDirectusItems()
const { refreshTokens, token } = useDirectusToken()

const drawer = ref(false)

const { data: settings, refresh } = useAsyncData(
  async () => {
    return await getSingletonItem<Settings>({
      collection: "settings",
    })
  },
  { lazy: true, server: false, immediate: true }
)

const refreshInterval = ref<NodeJS.Timer>()
onMounted(() => {
  refreshInterval.value = setInterval(async () => {
    refresh()
  }, 10000)
})
onBeforeUnmount(() => {
  clearInterval(refreshInterval.value)
})

const tokenInterval = ref<NodeJS.Timer>()
onMounted(() => {
  refreshTokens()
  tokenInterval.value = setInterval(async () => {
    refreshTokens()
  }, 700000)
})
onBeforeUnmount(() => {
  clearInterval(tokenInterval.value)
})

const menuList = ref([
  {
    icon: "local_shipping",
    label: "Fournisseur",
    link: "/provider",
    separator: false,
    childs: [
      {
        icon: "inbox",
        label: "Bon de commande",
        link: "/purshase_order",
        separator: true,
      },
      {
        icon: "inbox",
        label: "Bordereau de livraison",
        link: "/delivery_slip",
        separator: true,
      },
    ],
  },
  {
    icon: "handshake",
    label: "Client",
    link: "/consumer",
    separator: false,
    childs: [
      {
        icon: "inbox",
        label: "Facture de vente",
        link: "/sell_invoice",
        separator: true,
      },
      {
        icon: "inbox",
        label: "Bon de livraison",
        link: "/delivery_note",
        separator: true,
      },
    ],
  },
  {
    icon: "groups",
    label: "Personnel",
    link: "/staff",
    separator: true,
  },
  {
    icon: "checklist",
    label: "List de presence",
    link: "/presence",
    separator: false,
  },
  {
    icon: "event_note",
    label: "Travail Journalier",
    link: "/daily_work",
    separator: true,
  },
])
</script>

<template>
  <q-layout view="hHh Lpr lff" class="w-[100vw]">
    <q-header class="bg-blue-800">
      <q-toolbar>
        <q-btn flat @click="drawer = !drawer" round dense icon="menu" />
        <div class="w-4"></div>
        <NuxtLink to="/">
          <q-toolbar-title>{{ settings?.name }}</q-toolbar-title>
        </NuxtLink>
        <q-space />
        <div>
          <span>Stock : </span>
          <span class="text-xl font-semibold text-orange-100 pl-1">
            {{ formatNumberToDisplay(settings?.remaining_stock || 0) }} kg</span
          >
        </div>
        <q-space />
        <div class="flex space-x-5">
          <q-btn
            dense
            outline
            label="Etats des facture"
            @click="navigateTo('/financial_statement/statement/by_dates')"
          />
          <q-btn
            dense
            outline
            label="Etats du personnel"
            @click="navigateTo('/financial_statement/staff')"
          />
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="drawer" show-if-above :width="250" :breakpoint="500" bordered>
      <q-scroll-area class="fit">
        <q-list>
          <template v-for="(menuItem, index) in menuList" :key="index">
            <NuxtLink :to="menuItem.link">
              <q-expansion-item
                v-if="menuItem.childs"
                expand-icon-toggle
                :icon="menuItem.icon"
                :label="menuItem.label"
              >
                <q-list class="ml-4">
                  <template
                    v-for="(menuChildItem, childIndex) in menuItem.childs"
                    :key="childIndex"
                  >
                    <NuxtLink :to="menuChildItem.link">
                      <q-item clickable :active="menuChildItem.label === 'Outbox'" v-ripple>
                        <q-item-section avatar>
                          <q-icon :name="menuChildItem.icon" />
                        </q-item-section>
                        <q-item-section>
                          {{ menuChildItem.label }}
                        </q-item-section>
                      </q-item>
                    </NuxtLink>
                  </template>
                </q-list>
              </q-expansion-item>

              <q-item v-else clickable :active="menuItem.label === 'Outbox'" v-ripple>
                <q-item-section avatar>
                  <q-icon :name="menuItem.icon" />
                </q-item-section>
                <q-item-section>
                  {{ menuItem.label }}
                </q-item-section>
              </q-item>
              <q-separator :key="'sep' + index" v-if="menuItem.separator" />
            </NuxtLink>
          </template>
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <q-page padding>
        <NuxtPage />
      </q-page>
    </q-page-container>
  </q-layout>
</template>
