<script setup lang="ts">
import { Provider } from "~/domain/entities/Provider"
import { Failure } from "~/domain/Failure"

type State = {
  isError: boolean
  errorMessage: string | null
  provider: Provider | null
}

const state = useState((): State => ({ isError: false, errorMessage: null, provider: null }))

const getProvider = async (id: number) => {
  try {
    const response = await getProviderUseCase.execute(id)

    if (response instanceof Failure) {
      state.value.isError = true
      state.value.errorMessage = "response.message!"
    } else {
      state.value.provider = response
      state.value.isError = false
      state.value.errorMessage = null
    }
  } catch (err) {
    state.value.isError = true
    state.value.errorMessage = "err.message"
  }
}

onMounted(async () => {
  await getProvider(8)

  const response = await getSellInvoiceBetweenDatesUseCase.execute({
    minDate: new Date(2023, 3, 25),
    maxDate: new Date(2023, 4, 25),
  })
  console.log(response)

  const response2 = await getPurshaseOrderBetweenDatesUseCase.execute({
    minDate: new Date(2023, 3, 25),
    maxDate: new Date(2023, 4, 25),
  })
  console.log(response2)
})
</script>

<template>
  {{ state }}
</template>
