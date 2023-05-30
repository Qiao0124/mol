<template>
  <!-- 包装内置的 Transition 组件 -->
  <Transition appear mode="out-in">
    <slot></slot>
    <!-- 向内传递插槽内容 -->
  </Transition>
</template>

<style>
.v-enter-active,
.v-leave-active {
  transition: all 0.2s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
