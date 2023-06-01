<script setup lang="ts">
import { components } from "~/interfaces/nuxtus";
type Provider = components["schemas"]["ItemsProvider"];

type Props = {
  providers: Provider[];
};

const { providers } = defineProps<Props>();
</script>
<template>
  <div>
    <table class="table-auto w-full text-sm text-left text-gray-500">
      <thead class="text-xs text-gray-700 uppercase bg-gray-100">
        <tr>
          <th scope="col" class="px-6 py-3">nom</th>
          <th scope="col" class="px-6 py-3">ifu</th>
          <th scope="col" class="px-6 py-3">rccm</th>
          <th scope="col" class="px-6 py-3">téléphone</th>
        </tr>
      </thead>
      <tbody class="bg-white border-b">
        <tr v-for="provider in providers" class="bg-white border-b">
          <td class="px-6 py-4 font-medium">{{ provider.name }} tonnes</td>
          <td class="px-6 py-4 font-medium">{{ provider.ifu }} tonnes</td>
          <td class="px-6 py-4 font-medium">{{ provider.rccm }} tonnes</td>
          <td class="px-6 py-4 font-medium">
            {{ provider.tel }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
