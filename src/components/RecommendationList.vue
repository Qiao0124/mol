<template>
  <div class="_recommendation-list">
    <div class="_chat-container">
      <div class="button-to-return">
        <button @click="methods.clear">Clear</button>
      </div>
      <div class="chat-history">
        <div
          v-for="(message, msgIndex) in state.messages"
          :key="message.id"
          class="message"
          :class="message.isUser ? 'user' : 'bot'"
        >
          <img
            class="icon"
            src="@/assets/qms10.jpg"
            alt=""
            v-if="message.isUser"
          />
          <img class="icon" src="@/assets/qms9.jpg" alt="" v-else />
          <div class="molecules2d-list" v-if="message && !message.isUser">
            <div class="bot-hint" v-if="!message.isUser">
              Which ligands do you like or dislike? You need to mark your
              preferences and submit them.
            </div>
            <div
              class="molecules2d"
              v-for="(molecular, molIndex) in message.molecules"
              :key="molecular.id"
            >
              <div class="molecules2d-svg">
                <MoleculeStructure
                  :id="String(molecular.id)"
                  :structure="molecular.smiles"
                  :width="130"
                  :height="130"
                  :svgMode="true"
                />
              </div>
              <div class="btns">
                <button
                  @click="methods.like(molecular, msgIndex, molIndex)"
                  class="like"
                  :class="molecular.isLiked ? 'isLiked' : ''"
                  :disabled="molecular.isLiked || molecular.isSubmited"
                >
                  <img src="@/assets/like.svg" alt="" />
                </button>
                <button
                  @click="methods.dislike(molecular, msgIndex, molIndex)"
                  class="dislike"
                  :class="molecular.isDisliked ? 'isDisliked' : ''"
                  :disabled="molecular.isDisliked || molecular.isSubmited"
                >
                  <img src="@/assets/dislike.svg" alt="" />
                </button>
                <button @click="methods.preview(molecular)">
                  <img src="@/assets/preview.svg" alt="" />
                </button>
                <!-- <button @click="methods.selectMolecule(molecular)">
                  <img src="@/assets/select.svg" alt="" />
                </button> -->
              </div>
            </div>
            <div class="preferences-submit-btn">
              <button
                @click="methods.submitPreferrnce(msgIndex)"
                :disabled="!message.canSubmit"
              >
                Submit
              </button>
            </div>
          </div>
          <div class="molecules2d-list" v-else-if="message && message.isUser">
            <div class="user-hint">You like the following molecules.</div>
            <div
              class="molecules2d"
              v-for="molecular in message.likedMolecules"
              :key="molecular.id"
            >
              <div class="molecules2d-svg">
                <MoleculeStructure
                  :id="String(molecular.id)"
                  :structure="molecular.smiles"
                  :width="130"
                  :height="130"
                  :svgMode="true"
                />
              </div>
            </div>
            <div class="user-hint">You dislike the following molecules.</div>
            <div
              class="molecules2d"
              v-for="molecular in message.dislikedMolecules"
              :key="molecular.id"
            >
              <div class="molecules2d-svg">
                <MoleculeStructure
                  :id="String(molecular.id)"
                  :structure="molecular.smiles"
                  :width="130"
                  :height="130"
                  :svgMode="true"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reqMolecularRecommend } from "@/api";
import { MoleculeM, ChatRecommendationM } from "@/models";
import { reactive, onMounted, ref, watch, defineEmits } from "vue";
import MoleculeStructure from "./MoleculeStructure.vue";

const emit = defineEmits(["click-to-select", "click-to-preview"]);
const messages = ref([]);
const inputText = ref("");
const isSending = ref(false);
const isModifiedMolecular = ref(false);
const context = ref([]);

interface stateM {
  molecules: MoleculeM[];
  likedMolecules: MoleculeM[];
  dislikedMolecules: MoleculeM[];
  likedMoleculeIds: number[];
  dislikedMoleculeIds: number[];
  messages: ChatRecommendationM[];
}

const state: stateM = reactive({
  molecules: [],
  likedMolecules: [],
  likedMoleculeIds: [],
  dislikedMolecules: [],
  dislikedMoleculeIds: [],
  messages: [],
});

const methods = reactive({
  preview(molecule: MoleculeM) {
    console.log(molecule);
    emit("click-to-preview", molecule);
  },
  selectMolecule(molecule: MoleculeM) {
    console.log("selectMolecule", molecule);
    emit("click-to-select", molecule);
  },
  like(molecule: MoleculeM, msgIndex: number, molIndex: number) {
    console.log(molecule);
    state.messages[msgIndex].molecules[molIndex].isLiked = true;
    state.messages[msgIndex].molecules[molIndex].isDisliked = false;
    state.dislikedMolecules = state.dislikedMolecules.filter(
      (item) => item.id !== molecule.id
    );
    state.likedMolecules.push(molecule);
    state.likedMoleculeIds.push(molecule.id);
  },
  dislike(molecule: MoleculeM, msgIndex: number, molIndex: number) {
    console.log(molecule);
    state.messages[msgIndex].molecules[molIndex].isDisliked = true;
    state.messages[msgIndex].molecules[molIndex].isLiked = false;
    state.likedMolecules = state.likedMolecules.filter(
      (item) => item.id !== molecule.id
    );
    state.dislikedMolecules.push(molecule);
  },
  async submitPreferrnce(msgIndex: number) {
    state.messages[msgIndex].canSubmit = false;
    state.messages[msgIndex].molecules.forEach((molecule) => {
      molecule.isSubmited = true;
    });
    await sendMessage();
  },
  async clear() {
    state.messages = [];
    const moleculesRecommend: ChatRecommendationM = await reqMolecularRecommend(
      state.likedMoleculeIds
    );
    state.molecules = moleculesRecommend.molecules;
    console.log("moleculesRecommend", moleculesRecommend);
    state.messages.push(moleculesRecommend);
  },
});

const sendMessage = async () => {
  state.messages.push({
    id: Date.now(),
    isUser: true,
    molecules: state.likedMolecules,
    likedMolecules: state.likedMolecules,
    dislikedMolecules: state.dislikedMolecules,
    canSubmit: false,
  });

  inputText.value = "";
  isSending.value = true;

  // TODO: send message to openai server ( mock )
  setTimeout(async () => {
    const moleculesRecommend: ChatRecommendationM = await reqMolecularRecommend(
      state.likedMoleculeIds,
      state.dislikedMoleculeIds
    );
    state.molecules = moleculesRecommend.molecules;
    state.messages.push(moleculesRecommend);

    isSending.value = false;
    isModifiedMolecular.value = true;
  }, 1500);

  state.likedMolecules = [];
  state.likedMoleculeIds = [];
  state.dislikedMolecules = [];
  state.dislikedMoleculeIds = [];

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
  //   });

  //   isSending.value = false;
  //   isModifiedMolecular.value = true;
  // } else {
  //   alert("request error...")
  //   isSending.value = false;
  // }
};

onMounted(async () => {
  const moleculesRecommend: ChatRecommendationM = await reqMolecularRecommend(
    state.likedMoleculeIds
  );
  state.molecules = moleculesRecommend.molecules;
  console.log("moleculesRecommend", moleculesRecommend);
  state.messages.push(moleculesRecommend);

  const chatHistory = document.querySelector(".chat-history");
  chatHistory.scrollTop = chatHistory.scrollHeight;
});

watch(state.messages, () => {
  const chatHistory = document.querySelector(".chat-history");
  chatHistory.scrollTop = chatHistory.scrollHeight;
});

// when all molecules are liked or disliked, send message to openai server
// watch(
//   () => state.likedMolecules.length + state.dislikedMolecules.length,
//   () => {
//     if (
//       state.likedMolecules.length + state.dislikedMolecules.length ===
//       state.molecules.length
//     ) {
//       sendMessage();
//     }
//   }
// );
</script>

<style lang="scss" scoped>
._recommendation-list {
  width: 100%;
  height: 100%;
  background-color: white;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.15);
  ._chat-container {
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    height: 100%;
    border: none;
    padding-top: 10px;
    overflow-y: auto;
    .button-to-return {
      box-sizing: border-box;
      display: flex;
      justify-content: center;
      align-items: center;
      padding-bottom: 10px;
      border-bottom: 0.5px solid #ddd;
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
      .message {
        margin-bottom: 20px;
        display: flex;
        align-items: flex-start;
        padding: 7px;
        background: #fff;
        border-radius: 5px;
        border-bottom: 0.5px solid #ddd;
        .icon {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: 1px solid #e5e5e5;
          pointer-events: none;
          margin-right: 7px;
        }
        .molecules2d-list {
          box-sizing: border-box;
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: flex-start;
          width: calc(100% - 47px);
          padding: 10px;
          border-radius: 12px;
          background: #f8f8f8;
          text-align: start;
          word-wrap: break-word;
          overflow-wrap: break-word;
          .user-hint {
            width: 100%;
          }
          .bot-hint {
            width: 100%;
          }
          .molecules2d {
            position: relative;
            width: 130px;
            height: 160px;
            margin: 2px;
            border: 0.5px solid #ddd;
            border-radius: 12px;
            .molecules2d-svg {
              position: relative;
              width: 100%;
              height: calc(100% - 30px);
            }
            .btns {
              width: 100%;
              height: 30px;
              display: flex;
              align-items: center;
              justify-content: space-around;
              button {
                box-sizing: border-box;
                padding: 3px;
                margin: 2px;
                width: 25px;
                height: 25px;
                color: white;
                background: var(--primary-light7);
                border-radius: 5px;
                font-weight: bold;
                transition: background 0.3s;
                cursor: pointer;
                &:hover {
                  background: var(--primary-dark);
                }
                &:disabled {
                  background: #ddd;
                  cursor: not-allowed;
                  &:hover {
                    background: #ddd;
                  }
                }
                img {
                  width: 100%;
                  height: 100%;
                }
              }
              .like {
                background-color: #fde2e2;
                &:hover {
                  background: var(--red);
                }
                &.isLiked {
                  &:disabled {
                    background: var(--red-dark);
                    &:hover {
                      background: var(--red-dark);
                    }
                  }
                }
              }
              .dislike {
                background-color: #fde2e2;
                &:hover {
                  background: var(--red);
                }
                &.isDisliked {
                  &:disabled {
                    background: var(--red-dark);
                    &:hover {
                      background: var(--red-dark);
                    }
                  }
                }
              }
            }
          }
          .preferences-submit-btn {
            width: 100%;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
            button {
              box-sizing: border-box;
              padding: 3px;
              width: 80px;
              height: 25px;
              color: white;
              background: var(--primary);
              border-radius: 5px;
              font-weight: bold;
              transition: background 0.3s;
              cursor: pointer;
              &:hover {
                background: var(--primary-dark);
              }
              &:disabled {
                background: #ddd;
                cursor: not-allowed;
                &:hover {
                  background: #ddd;
                }
              }
              img {
                width: 100%;
                height: 100%;
              }
            }
          }
        }
      }
    }
  }
}
</style>
