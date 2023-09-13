<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="_evaluate">
    <FadeTransition>
      <div v-if="state.waiting">
        <span>You need to make more annotations...</span>
      </div>
      <div v-else-if="state.ready" class="ready">
        <span
          >You have made some annotations, do you want to know if I have got
          your idea?</span
        >
        <button @click="getMolsAiGenerated" v-loading="state.pending">
          Yes
        </button>
      </div>
      <div v-else-if="state.pending">
        <span>fetching...</span>
      </div>
      <div v-else-if="state.fetchFinish" class="fetch-finish">
        <div class="mols">
          <div
            class="molecules2d"
            v-for="molecular in state.molecules"
            :key="molecular.id"
          >
            <div class="molecules2d-svg">
              <MoleculeStructure :imgURL="molecular.pngUrl" />
            </div>
            <div class="btns">
              <button @click="preview(molecular)">
                <img src="@/assets/preview.svg" alt="" />
              </button>
              <!-- <button @click="methods.selectMolecule(molecular)">
            <img src="@/assets/select.svg" alt="" />
          </button> -->
            </div>
          </div>
        </div>
        <div class="check-effect-btn">
          <el-rate
            v-model="state.score"
            :disabled="!state.canScore"
            :texts="['oops', 'disappointed', 'normal', 'good', 'great']"
          />
          <button @click="scoreAiEffects(state.score)">Submit score</button>
        </div>
      </div>
      <div v-else-if="state.scoreFinish">
        submitted success! Going to the next round...
      </div>
    </FadeTransition>
  </div>
</template>

<script lang="ts" setup>
import { reactive, defineEmits, watch } from "vue";
import * as models from "@/models";
import * as api from "@/api";
import { useMolStore } from "@/store";
import { ElNotification } from "element-plus";
import FadeTransition from "./FadeTransition.vue";

const molStore = useMolStore();
const emits = defineEmits(["preview"]);
interface stateM {
  waiting: boolean; // 尚未收到 true check prompt
  ready: boolean; // 准备好 evaluate 了
  pending: boolean; // 正在获取 ai 学习成果
  fetchFinish: boolean; // 已获取 ai 学习成果，待评价
  scoreFinish: boolean; // 已评价，显示成功页面
  molecules: models.MoleculeM[]; // 获取的 ai 学习成果
  score: number;
  canScore: boolean;
}

const state: stateM = reactive({
  waiting: true,
  ready: false,
  pending: false,
  fetchFinish: false,
  scoreFinish: false,
  molecules: [],
  score: 0,
  canScore: false,
});

const resetView = () => {
  state.waiting = false;
  state.ready = false;
  state.pending = false;
  state.fetchFinish = false;
  state.scoreFinish = false;
  state.canScore = false;
};

const scoreAiEffects = async (score: number) => {
  state.canScore = false;
  await api.reqScoreEffect(score, molStore.getTimestamp());
  state.fetchFinish = false;
  state.scoreFinish = true;
  setTimeout(() => {
    state.scoreFinish = false;
    // 先检查下一轮是否已准备好，这里先不检查了
    state.ready = true;
  }, 2000);
};

const getMolsAiGenerated = async () => {
  resetView();
  state.pending = true;
  const molecules: models.MoleculeM[] = await api.reqGetSdfsAiGenerated(
    molStore.getTimestamp()
  );
  state.molecules = molecules;
  state.pending = false;
  state.fetchFinish = true;
  state.canScore = true;
};

const preview = async (molecular: models.MoleculeM) => {
  emits("preview", molecular);
};

watch(
  () => molStore.checkPrompt,
  (val) => {
    if (val && state.waiting) {
      state.waiting = false;
      state.ready = true;
      ElNotification({
        title: "New evaluation available!",
        message: `You can go to the Evaluate page by clicking the "Evaluate" tab at the top`,
        position: "bottom-left",
        type: "success",
        duration: 8000,
      });
    }
  }
);
</script>

<style lang="scss" scoped>
._evaluate {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  overflow-y: auto;
  .ready {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    button {
      margin-top: 10px;
    }
  }
  .fetch-finish {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    .mols {
      width: 100%;
      display: flex;
      justify-content: space-around;
      flex-wrap: wrap;
      align-items: center;
      margin-bottom: 20px;
      padding: 20px;
      box-sizing: border-box;
      .molecules2d {
        position: relative;
        width: 130px;
        height: 160px;
        margin: 30px;
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
    }
    .check-effect-btn {
      display: flex;
      flex-direction: column;
      button {
        margin-top: 10px;
        padding: 10px;
        box-sizing: border-box;
      }
    }
  }
}
</style>
