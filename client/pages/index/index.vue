<script setup lang="ts">
import { components } from "~/interfaces/nuxtus"
import moment from "moment"
definePageMeta({
  middleware: ["auth"],
})

const { logout } = useDirectusAuth()
</script>

<template>
  <div>
    <nav class="flex justify-between">
      <img src="/img/boussole.jpg" alt="Boussole" class="w-32" />
      <q-btn class="h-min" color="primary" label="Deconnexion" @click="logout()" />
    </nav>
    <!-- <h3 class="titre">Gestion d'une entreprise</h3> -->
  </div>
  <div class="flex flex-wrap w-4/5 mx-auto">
    <Graphe />
    <Circulaire />
    <Bar />
  </div>
</template>
