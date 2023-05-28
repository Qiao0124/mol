<template>
  <div class="_navigation-bar">
    <div class="items">
      <div class="nav-item">Chats</div>
      <div class="nav-item">Tutorial</div>
      <div class="nav-item">Contact</div>
      <div class="nav-item">Reference</div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
._navigation-bar {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  width: 100%;
  height: 100%;
  top: 0px;
  background-color: var(--nav-bg);

  .items {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    height: 40%;
  }
  .nav-item {
    color: white;
    cursor: pointer;
    margin-bottom: 24px;
    font-size: 14px;
    &:hover {
      color: var(--primary-light5);
    }
  }
}
</style>
