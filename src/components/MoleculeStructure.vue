<template>
  <div class="_molecule-structure">
    <img :src="props.imgURL" width="130" height="130">
  </div>
</template>

<script setup lang="ts">
import { defineProps } from "vue";

const props = defineProps(["imgURL"]);
</script>

<style lang="scss" scoped>
.molecule-structure {
  width: 100%;
  height: 100%;
  img {
    width: 100%;
    height: 100%;
  }
}
</style>
