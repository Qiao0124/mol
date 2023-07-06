<template>
  <div class="_chats">
    <div class="chats-history">
      <ChatsHistory />
    </div>
    <div class="main-left recommendations" v-if="!state.inFormal.showing">
      <RecommendationList
        @click-to-select="selectMolecule"
        @click-to-preview="previewMolecule"
      />
    </div>
    <div class="main-left chat-area" v-else>
      <dialog-box
        @return-to-select="methods.returnToSelect"
        @switch-molecular="methods.freshFormal"
        @answer-complete="methods.freshFormal(true)"
      />
    </div>
    <div class="main-right render-area">
      <div class="pre-view render-view" v-if="state.inPreview.showing">
        <MolstarRender
          :url="currentPreviewUrl"
          :smiles="state.inPreview.previewMolecule.smiles"
        />
        <div class="statistics-indexs">
          <StatisticsIndexs
            v-for="(statistic, key, index) in state.inPreview.previewMolecule.statisticsIndexs"
            :key="index"
            :type="key"
            :value="statistic"
          />
        </div>
      </div>
      <div class="formal-view render-view" v-else-if="state.inFormal.showing">
        <MolstarRender
          :url="currentFormalUrl"
          :smiles="state.inPreview.previewMolecule.smiles"
        />
        <div class="statistics-indexs">
          <StatisticsIndexs
            v-for="(statistic, key, index) in currentFormalStatisticsIndexs"
            :key="index"
            :type="key"
            :value="statistic"
          />
        </div>
      </div>
      <div class="tint" v-else>
        Here will render the molecular structure based on Molar...
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import MolstarRender from "@/components/MolstarRender.vue";
import RecommendationList from "@/components/RecommendationList.vue";
import StatisticsIndexs from "@/components/StatisticsIndexs.vue";
import { ref, onMounted, watch, reactive, computed } from "vue";
import { MoleculeM, ChatRecommendationM } from "@/models";
import DialogBox from "@/components/DialogBox.vue";
import ChatsHistory from "@/components/ChatsHistory.vue";

interface stateM {
  inPreview: {
    showing: boolean;
    previewMolecule: MoleculeM;
  };
  inFormal: {
    showing: boolean;
    formalMolecule: MoleculeM;
    isModified: boolean;
  };
}

const state: stateM = reactive({
  inPreview: {
    showing: false,
    previewMolecule: {} as MoleculeM,
  },
  inFormal: {
    showing: false,
    formalMolecule: {} as MoleculeM,
    isModified: false,
  },
});

const selectMolecule = (molecule: MoleculeM) => {
  state.inFormal.formalMolecule = molecule;
  state.inFormal.showing = true;
  state.inPreview.showing = false;
};
const previewMolecule = (molecule: MoleculeM) => {
  state.inPreview.previewMolecule = molecule;
  state.inPreview.showing = true;
  state.inFormal.showing = false;
};

const methods = {
  tint() {
    state.inPreview.showing = false;
    state.inFormal.showing = false;
  },
  returnToSelect() {
    state.inPreview.showing = false;
    state.inFormal.showing = false;
  },
  async freshFormal(isModified: boolean) {
    state.inFormal.isModified = isModified;
  },
};

const currentFormalUrl = computed(() => {
  if (state.inFormal.isModified) {
    return "./examples/protein_ligand/protein_ligand_0.pdb";
  } else {
    return "./examples/protein_ligand/protein_ligand_1.pdb";
  }
});

const currentPreviewUrl = computed(() => {
  return (
    "./examples/" +
    state.inPreview.previewMolecule.name +
    "/before_" +
    state.inPreview.previewMolecule.name +
    ".sdf"
  );
});

const currentFormalStatisticsIndexs = computed(() => {
  return {
    num_atoms: 34,
    num_bonds: 36,
    num_rings: 3,
    num_H_donors: 3,
    num_H_acceptors: 6,
    num_rotatable_bonds: 10,
    QED: 0.4107814551480482,
    SA: 0.79,
    LogP: 1.8503999999999996,
  };
});
</script>

<style lang="scss" scoped>
._chats {
  display: flex;
  width: 100%;
  height: 100%;
  .chats-history {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 192px;
    height: 100%;
  }
  .main-left {
    width: 750px;
    height: 100%;
    background-color: white;
  }
  .main-right {
    width: calc(100% - 942px);
    height: 100%;
    overflow-y: auto;
    .render-view {
      width: 100%;
      height: 600px;
      .statistics-indexs {
        background-color: white;
      }
    }
    .tint {
      display: flex;
      align-items: center;
      justify-content: center;
      box-sizing: border-box;
      padding: 24px;
      width: 100%;
      height: 100%;

      font-size: 20px;
      font-weight: 400;
    }
  }
}
</style>
