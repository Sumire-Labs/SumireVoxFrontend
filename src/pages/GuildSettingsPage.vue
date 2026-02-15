<script setup>
import HeaderBar from "@/components/HeaderBar.vue";

const props = defineProps({
  id: { type: String, required: true },
});
</script>

<template>
  <div class="page">
    <HeaderBar brand-name="Sumire Vox Bot" />

    <div style="padding: 24px;">
      <h1>Guild Settings</h1>
      <p>guild id: {{ props.id }}</p>
    </div>
  </div>
</template>