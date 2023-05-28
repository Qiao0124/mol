<template>
  <div class="app">
    <div class="navigation">
      <navigation-bar />
    </div>
    <div
      class="router-view"
      style="background: url(@/../img/bg2.jpg) no-repeat center/100% 100%"
    >
      <router-view />
    </div>
  </div>
</template>

<script lang="ts" setup>
import NavigationBar from "./components/NavigationBar.vue";
</script>

<style lang="scss" scoped>
.app {
  display: flex;
  .navigation {
    width: 64px;
    height: 100vh;
  }
}
.router-view {
  height: 100vh;
  width: calc(100vw - 64px);
}
</style>
