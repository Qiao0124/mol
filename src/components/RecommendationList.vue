<template>
  <div class="_recommendation-list">
    <div class="_chat-container">
      <div class="button-to-return">
        <button @click="methods.clear">Clear</button>
      </div>
      <div class="chat-history" ref="scrollDiv">
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
            <div
              class="bot-hint"
              v-if="!message.isUser && !message.isAiGenerated"
            >
              Which molecules do you like or dislike? You need to mark your
              preferences and submit them.
            </div>
            <div
              class="molecules2d"
              v-for="(molecular, molIndex) in message.molecules"
              :key="molecular.id"
            >
              <div class="molecules2d-svg">
                <MoleculeStructure :imgURL="molecular.pngUrl" />
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
            <div class="preferences-submit-btn" v-if="!message.isAiGenerated">
              <button
                @click="methods.likeAll(msgIndex)"
                :disabled="!message.canSubmit"
              >
                Like all
              </button>
              <button
                @click="methods.dislikeAll(msgIndex)"
                :disabled="!message.canSubmit"
              >
                Dislike all
              </button>
              <button
                @click="methods.submitPreferrnce(msgIndex)"
                :disabled="!message.canSubmit"
              >
                Submit
              </button>
            </div>
          </div>
          <div class="molecules2d-list" v-else-if="message && message.isUser">
            <div class="user-hint" v-if="message.likedMolecules.length == 8">
              You like all of the proposed molecules.
            </div>
            <div class="user-hint" v-else-if="message.likedMolecules.length">
              <div class="user-hint">You like the following molecules.</div>
              <div
                class="molecules2d"
                v-for="molecular in message.likedMolecules"
                :key="molecular.id"
              >
                <div class="molecules2d-svg">
                  <MoleculeStructure :imgURL="molecular.pngUrl" />
                </div>
              </div>
            </div>

            <div class="user-hint" v-if="message.dislikedMolecules.length == 8">
              You dislike all of the proposed molecules.
            </div>
            <div class="user-hint" v-else-if="message.dislikedMolecules.length">
              <div class="user-hint">You dislike the following molecules.</div>
              <div
                class="molecules2d"
                v-for="molecular in message.dislikedMolecules"
                :key="molecular.id"
              >
                <div class="molecules2d-svg">
                  <MoleculeStructure :imgURL="molecular.pngUrl" />
                </div>
              </div>
            </div>
            <div
              class="user-hint"
              v-if="
                !message.dislikedMolecules.length &&
                !message.likedMolecules.length
              "
            >
              You made no annotations.
            </div>
          </div>
        </div>
        <FadeTransition>
          <div class="loading" v-if="state.loading">
            <Loading />
          </div>
        </FadeTransition>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import * as api from "@/api";
import { MoleculeM, ChatRecommendationM } from "@/models";
import { reactive, onMounted, ref, watch, defineEmits } from "vue";
import { useMolStore } from "@/store/index";
import MoleculeStructure from "./MoleculeStructure.vue";
import Loading from "@/components/Loading.vue";
import FadeTransition from "@/components/FadeTransition.vue";

const emit = defineEmits(["click-to-select", "click-to-preview"]);
const inputText = ref("");
const isSending = ref(false);
const isModifiedMolecular = ref(false);
const molStore = useMolStore();
const scrollDiv = ref();

interface stateM {
  molecules: MoleculeM[];
  likedMolecules: MoleculeM[];
  dislikedMolecules: MoleculeM[];
  likedMoleculeIds: number[];
  dislikedMoleculeIds: number[];
  messages: ChatRecommendationM[];
  loading: boolean;
}

const state: stateM = reactive({
  molecules: [],
  likedMolecules: [],
  likedMoleculeIds: [],
  dislikedMolecules: [],
  dislikedMoleculeIds: [],
  messages: [],
  isAiGenerating: false,
  loading: true,
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
    state.dislikedMoleculeIds = state.dislikedMoleculeIds.filter(
      (id) => id !== molecule.id
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
    state.likedMoleculeIds = state.likedMoleculeIds.filter(
      (id) => id !== molecule.id
    );
    state.dislikedMolecules.push(molecule);
    state.dislikedMoleculeIds.push(molecule.id);
  },
  likeAll(msgIndex: number) {
    state.messages[msgIndex].molecules.forEach((molecule) => {
      molecule.isLiked = true;
      molecule.isDisliked = false;
    });
    state.likedMolecules = state.messages[msgIndex].molecules;
    state.likedMoleculeIds = state.likedMolecules.map((item) => item.id);
    state.dislikedMolecules = [];
    state.dislikedMoleculeIds = [];
  },
  dislikeAll(msgIndex: number) {
    state.messages[msgIndex].molecules.forEach((molecule) => {
      molecule.isDisliked = true;
      molecule.isLiked = false;
    });
    state.dislikedMolecules = state.messages[msgIndex].molecules;
    state.dislikedMoleculeIds = state.dislikedMolecules.map((item) => item.id);
    state.likedMolecules = [];
    state.likedMoleculeIds = [];
  },
  async submitPreferrnce(msgIndex: number) {
    state.messages[msgIndex].canSubmit = false;
    state.messages[msgIndex].molecules.forEach((molecule) => {
      molecule.isSubmited = true;
    });
    state.messages.push({
      id: Date.now(),
      isUser: true,
      molecules: state.likedMolecules,
      likedMolecules: state.likedMolecules,
      dislikedMolecules: state.dislikedMolecules,
      canSubmit: false,
    });
    console.log("Submit 1!");
    inputText.value = "";
    isSending.value = true;
    await sendMessage();
  },
  async clear() {
    state.messages = [];
    const moleculesRecommend: ChatRecommendationM =
      await api.reqSubmitMolPreference(
        molStore.getCurrentPdbId(),
        molStore.getTimestamp(),
        [],
        []
      );
    state.molecules = moleculesRecommend.molecules;
    console.log("moleculesRecommend", moleculesRecommend);
    state.messages.push(moleculesRecommend);
  },
});

const sendMessage = async () => {
  // TODO: send message to openai server ( mock )
  state.loading = true;
  const moleculesRecommend: ChatRecommendationM =
    await api.reqSubmitMolPreference(
      molStore.getCurrentPdbId(),
      molStore.getTimestamp(),
      state.likedMoleculeIds,
      state.dislikedMoleculeIds
    );
  console.log("Submit 2!");
  console.log("readyToCheck?", moleculesRecommend.readyToCheck);
  molStore.setCheckPrompt(moleculesRecommend.readyToCheck ? true : false);
  state.molecules = moleculesRecommend.molecules;
  state.messages.push(moleculesRecommend);

  state.loading = false;
  isSending.value = false;
  isModifiedMolecular.value = true;
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
  const moleculesRecommend = molStore.getInitialRecommendation();
  state.molecules = moleculesRecommend.molecules;
  console.log("moleculesRecommend", moleculesRecommend);
  state.messages.push(moleculesRecommend);
  state.loading = false;

  scrollDiv.value.scrollTop = scrollDiv.value.scrollHeight;
  console.log("chatHistory.scrollHeight", scrollDiv.value.scrollHeight);
});

watch(state.messages, () => {
  scrollDiv.value.scrollTop = scrollDiv.value.scrollHeight;
  console.log("chatHistory.scrollHeight", scrollDiv.value.scrollHeight);
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
    padding-top: 5px;
    padding-bottom: 25px;
    .button-to-return {
      box-sizing: border-box;
      display: flex;
      justify-content: center;
      align-items: center;
      padding-bottom: 5px;
      border-bottom: 0.5px solid #ddd;
      button {
        height: 30px;
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
      width: 100%;
      height: 100%;
      flex: 1;
      overflow-y: auto;
      .message {
        box-sizing: border-box;
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
          margin-right: 6px;
        }
        .molecules2d-list {
          box-sizing: border-box;
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: flex-start;
          width: calc(100% - 46px);
          padding: 8px;
          border-radius: 12px;
          background: #f8f8f8;
          text-align: start;
          word-wrap: break-word;
          overflow-wrap: break-word;
          .user-hint {
            width: 100%;
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            justify-content: flex-start;
            width: calc(100% - 46px);
            background: #f8f8f8;
            text-align: start;
            word-wrap: break-word;
            overflow-wrap: break-word;
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
              margin: 10px;
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
      .loading {
        width: 100%;
        height: 10px;
        border-radius: 2px;
        position: absolute;
        bottom: 8px;
      }
    }
  }
}
</style>
