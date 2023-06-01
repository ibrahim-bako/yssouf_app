<template>
  <div>
    <label :for="name" class="text-lg font-semibold">{{ label }}</label>
    <span v-if="props.required" class="text-red-600 text-lg pl-1">*</span>
    <input
      :id="name"
      :name="name"
      v-model="str"
      :class="[shared, size]"
      :required="props.required"
    />
  </div>
</template>

<script setup lang="ts">
enum SizeProps {
  sm = "sm",
  md = "md",
  lg = "lg",
}
type Props = {
  name: string;
  label: string;
  sizep?: SizeProps;
  value?: string;
  required?: boolean;
};

const props = defineProps<Props>();

const emit = defineEmits(["onChange"]);

let str = ref("");

const shared =
  "block w-full border shadow border-gray-500 rounded-md font-medium";
const sm = "py-2 px-3 text-md";
const md = "py-3 px-4 text-md";
const lg = "py-3 px-4 sm:p-5 text-lg";

const size = computed(() => {
  switch (props.sizep) {
    case SizeProps.sm:
      return sm;
    case SizeProps.md:
      return md;
    case SizeProps.lg:
      return lg;
    default:
      return sm;
  }
});

watchEffect(() => {
  emit("onChange", str);
});
</script>
