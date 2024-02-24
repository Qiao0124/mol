<template>
  <Transition appear mode="out-in">
    <slot></slot>
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
