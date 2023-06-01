<script setup lang="ts">
definePageMeta({
  middleware: ["auth"],
})
</script>

<template>
  <div>
    <top-bar>
      <template v-slot:right>
        <div class="flex space-x-5">
          <NuxtLink to="/financial_statement/statement/by_product_type">
            <q-btn label="par designation" dense outline />
          </NuxtLink>
          <NuxtLink to="/financial_statement/statement/by_dates">
            <q-btn label="par dates" dense outline />
          </NuxtLink>
          <NuxtLink to="/financial_statement/statement/by_provider">
            <q-btn label="par fournisseurs" dense outline />
          </NuxtLink>
          <NuxtLink to="/financial_statement/statement/by_consumer">
            <q-btn label="par client" dense outline />
          </NuxtLink>
        </div>
      </template>
    </top-bar>
    <div class="  ">
      <NuxtPage />
    </div>
  </div>
</template>
