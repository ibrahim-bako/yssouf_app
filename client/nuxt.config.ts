// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default {
  ssr: false,
  buildModules: ["@nuxtjs/google-fonts"],
  modules: [
    "@nuxtus/nuxt-localtunnel",
    "@vueuse/nuxt",
    "@nuxtjs/tailwindcss",
    "@sidebase/nuxt-pdf",
    "nuxt-directus",
    "@nuxtus/nuxt-module",
    "nuxt-quasar-ui",
  ],
  quasar: {
    lang: "fr",
    plugins: ["Notify", "Dialog"],
    config: {},
    extras: {
      fontIcons: ["material-icons"],
    },
  },
  googleFonts: {
    families: {
      Inter: true,
    },
  },
  tailwindcss: {
    // Options
    // jit: true,
    viewer: false,
  },
  directus: {
    // token: process.env.NUXT_PUBLIC_NUXTUS_DIRECTUS_TOKEN,

    url: "http://localhost:8055",
  },
  nuxtus: {
    authDirectus: false,
  },
  runtimeConfig: {
    public: {},
  },
}
