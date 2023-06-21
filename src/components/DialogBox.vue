<template>
  <div class="_chat-container">
    <div class="button-to-return">
      <button @click="clickReslect">Reselect</button>
    </div>
    <div class="chat-history">
      <div
        v-for="message in messages"
        :key="message.id"
        class="message"
        :class="message.role"
      >
        <img
          class="icon"
          src="@/assets/qms10.jpg"
          alt=""
          v-if="message.role == 'user'"
        />
        <img class="icon" src="@/assets/qms9.jpg" alt="" v-else />
        <div class="txt">
          {{ message.text }}
        </div>
      </div>
    </div>
    <div class="switch" @click="toogleMolecularState" v-if="validMessages">
      <div class="switch-item" v-if="isModifiedMolecular">
        Switch to the original molecular structure
      </div>
      <div class="switch-item" v-else>
        Switch to the modified molecular structure
      </div>
    </div>
    <div class="input-container">
      <textarea v-model="inputText" type="text" class="input" />
      <button @click="sendMessage" :disabled="isSending" class="send-button">
        {{ isSending ? "Waiting for reply" : "Send" }}
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, onMounted, defineEmits, computed } from "vue";
import { reqSendMessage } from "@/api";

const emit = defineEmits([
  "answer-complete",
  "switch-molecular",
  "return-to-select",
]);
const messages = ref([]);
const inputText = ref("");
const isSending = ref(false);
const isModifiedMolecular = ref(false);
const context = ref([]);

const toogleMolecularState = () => {
  isModifiedMolecular.value = !isModifiedMolecular.value;
  emit("switch-molecular", isModifiedMolecular.value);
};

const clickReslect = () => {
  emit("return-to-select");
};

const sendMessage = async () => {
  if (inputText.value.trim() === "") {
    return;
  }

  messages.value.push({
    id: Date.now(),
    text: inputText.value.trim(),
    role: "user",
    chatId: 1,
  });

  inputText.value = "";
  isSending.value = true;

  // TODO: send message to openai server ( mock )
  setTimeout(() => {
    messages.value.push({
      id: Date.now(),
      text: "Molecular structure has been modified and rerendered",
      role: "bot",
      chatId: 1,
    });

    isSending.value = false;
    isModifiedMolecular.value = true;
    emit("answer-complete");
  }, 1500);

  // TODO: send message to openai server (Comment out the code for the mock before using the following code)
  // let { isOk, newContext, reply } = await reqSendMessage(
  //   inputText.value.trim(),
  //   context.value
  // );
  // if (isOk) {
  //   context.value = newContext;
  //   messages.value.push({
  //     id: Date.now(),
  //     text: reply,
  //     role: "bot",
  //     chatId: 1,
  //   });

  //   isSending.value = false;
  //   isModifiedMolecular.value = true;
  //   emit("answer-complete");
  // } else {
  //   alert("request error...")
  //   isSending.value = false;
  // }
};

const validMessages = computed(() => {
  return messages.value.length > 1;
});

watch(messages, () => {
  const chatHistory = document.querySelector(".chat-history");
  chatHistory.scrollTop = chatHistory.scrollHeight;
});

onMounted(() => {
  const chatHistory = document.querySelector(".chat-history");
  chatHistory.scrollTop = chatHistory.scrollHeight;
});
</script>

<style lang="scss" scoped>
._chat-container {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  height: 100%;
  border: 1px solid #ccc;
  padding: 10px;

  overflow-y: auto;
}

.button-to-return {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 10px;
  button {
    padding: 5px 10px;
    border-radius: 5px;
    background: #eee;
    cursor: pointer;
    &:hover {
      background: #ddd;
    }
  }
}

.chat-history {
  flex: 1;
  overflow-y: auto;
}

.switch {
  margin-top: 10px;
  margin-bottom: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  .switch-item {
    padding: 5px 10px;
    border-radius: 5px;
    background: #eee;
    &:hover {
      background: #ddd;
    }
  }
}

.message {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  &.user {
  }
  &.bot {
  }
  .icon {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: 1px solid #e5e5e5;
    pointer-events: none;
  }
  .txt {
    margin-left: 10px;
    padding: 10px;
    border-radius: 5px;
    background: #eee;
    text-align: start;

    word-wrap: break-word;
    overflow-wrap: break-word;
  }
}

.input-container {
  box-sizing: border-box;
  width: 100%;
  margin-top: 10px;
  border-top: 1px solid #e5e5e5;
}

.input {
  box-sizing: border-box;
  width: 100%;
  flex: 1;
  padding: 5px;
  height: 100px;
  border: none;
  resize: none;
  :active {
    border: none;
  }
}

.send-button {
  height: 30px;
  min-width: 60px;
  margin-left: 5px;
  float: right;
  color: white;
  border-radius: 8px;
  background: var(--primary);
  cursor: pointer;
  &:hover {
    background-color: var(--primary-dark);
  }
}
</style>
