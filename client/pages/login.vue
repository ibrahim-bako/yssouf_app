<template>
  <div class="mx-auto mt-20 w-80 border shadow p-8 rounded-md">
    <form @submit.prevent="onSubmit" class="">
      <div class="space-y-4">
        <h2 class="text-2xl font-semibold">LOGIN</h2>
        <div class="q-gutter-md">
          <q-input type="text" outlined v-model="email" label="Email" />
          <q-input type="password" outlined v-model="password" label="Password" />
        </div>
        <q-btn type="submit" color="primary" label="Connexion" />
      </div>
    </form>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: [
    function (to, _from) {
      const user = useDirectusUser()
      if (user.value) {
        return navigateTo("/")
      }
    },
  ],
})

import validator from "validator"

const email = ref("")
const password = ref("")

const $q = useQuasar()

const msg = ref(false)
function verification() {
  msg.value = !msg.value
}

const { login } = useDirectusAuth()

const { data, error, pending, execute } = useAsyncData(
  async () => {
    return await login({
      email: email.value,
      password: password.value,
    })
  },
  { immediate: false, server: true, lazy: true }
)

const onSubmit = async () => {
  try {
    if (!validator.isEmail(email.value) || validator.isEmpty(email.value)) {
      return $q.notify({
        position: "top",
        color: "red",
        message: "Entrez un email valide",
      })
    }

    if (validator.isEmpty(password.value)) {
      return $q.notify({
        position: "top",
        color: "red",
        message: "Entrez un mot de passe",
      })
    }

    const { access_token, refresh_token, expires, user } = await login({
      email: email.value,
      password: password.value,
    })

    return navigateTo("/")
  } catch (e) {
    return $q.notify({
      position: "top",
      color: "red",
      message: "Indentifiants invalide",
    })
  }
}

// const onSubmit = async () => {
//   login({ email: email.value, password: password.value }).then((value) => {
//     console.log(value)
//   })

//   // execute().then(() => {
//   //   setTimeout(() => {
//   //     if (error.value) {
//   //       $q.notify({
//   //         message: error.value.message,
//   //         color: "red",
//   //       })
//   //     } else {
//   //       $q.notify({
//   //         message: "SUCCESS",
//   //         color: "green",
//   //       })
//   //       navigateTo({ path: "/" })
//   //     }
//   //   }, 200)
//   // })
// }
</script>
