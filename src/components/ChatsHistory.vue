<template>
  <div class="_chats-history">
    <div class="topbar">Ligand Generation</div>
    <div class="chats-list">
      <div class="chats-list-item">
        <div class="item-icon">
          <img src="@/assets/qms10.jpg" alt="" />
        </div>
        <div class="item-title">
          <div class="title">Expert</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
._chats-history {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background-color: rgb(239, 239, 239);
  .topbar {
    box-sizing: border-box;
    padding: 5px;
    display: flex;
    align-items: center;
    height: 48px;
    border-bottom: 1.5px solid #ccc;
    font-size: 18px;
    font-weight: 500;
  }
  .chats-list {
    box-sizing: border-box;
    padding: 4px;
    .chats-list-item {
      display: flex;
      align-items: stretch;
      box-sizing: border-box;
      padding: 4px;
      background-color: rgb(210, 210, 210);
      border-radius: 6px;
      cursor: pointer;
      .item-icon {
        margin-right: 5px;
      }
      .item-title {
        font-size: 18px;
        font-weight: 700;
      }
    }
  }
}
</style>
