<template>
  <div class="_molecule-structure">
    <img :src="modifyPngUrlString(props.imgURL)" width="130" height="130">
  </div>
</template>

<script setup lang="ts">
import { defineProps } from "vue";

const props = defineProps(["imgURL"]);

function modifyPngUrlString(inputString: string) {
  const searchString = "backend/app01/";
  const replacementString = "";

  if (inputString.includes(searchString)) {
    const modifiedString = inputString.replace(searchString, replacementString);
    return modifiedString;
  } else {
    return inputString; // 如果字符串中不包含要替换的部分，直接返回原字符串
  }
}
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
