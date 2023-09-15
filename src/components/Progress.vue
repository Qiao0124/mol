<template>
  <div class="_progress">
    <el-progress
      type="dashboard"
      :percentage="percentage.toFixed(2)"
      :color="colors"
    />
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, defineProps, watch } from "vue";

const props = defineProps({
  finish: Boolean,
});
const percentage = ref(0);
const status = ref("");
let interval: any;

const colors = [
  { color: "#f56c6c", percentage: 20 },
  { color: "#e6a23c", percentage: 40 },
  { color: "#5cb87a", percentage: 60 },
  { color: "#1989fa", percentage: 80 },
  { color: "#13ce66", percentage: 100 },
];
onMounted(() => {
  interval = setInterval(() => {
    if (percentage.value <= 96) {
      percentage.value = percentage.value + Math.random() * 2;
    } else {
      window.clearInterval(interval);
    }
  }, Math.random() * 2000);
});

watch(
  () => props.finish,
  (val) => {
    if (val) {
      window.clearInterval(interval);
      percentage.value = 100;
      status.value = "success";
    }
  }
);
</script>
<style lang="scss">
._progress {
  padding: 50px;
  box-sizing: border-box;
  .el-progress--line {
    margin-bottom: 15px;
    width: 350px;
  }
  .el-progress--circle {
    margin-right: 15px;
  }
}
</style>
