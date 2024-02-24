<!-- eslint-disable prettier/prettier -->
<template>
  <div class="_chats">
    <div class="chats-history">
      <ChatsHistory />
    </div>
    <div
      class="main-left pdf-select-or-upload"
      v-if="state.inPdbSelect.showing"
    >
      <PdbSeletcOrUpload
        @pdb-selected="renderPdb"
        @pdb-uploaded="uploadPdb"
        @sdfs-got="exitPdbSelectAndEnterPreferenceSubmitPage"
      />
    </div>
    <div class="main-left recommendations" v-else-if="!state.inFormal.showing">
      <el-tabs v-model="state.activeTab" class="demo-tabs" :stretch="true">
        <el-tab-pane label="Preference submit" name="preference">
          <RecommendationList
            @click-to-select="selectMolecule"
            @click-to-preview="previewMolecule"
          />
        </el-tab-pane>
        <el-tab-pane label="Evaluate" name="evaluate">
          <Evaluate @preview="previewMolecule"/>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div class="main-left chat-area" v-else>
      <dialog-box
        @return-to-select="methods.returnToSelect"
        @switch-molecular="methods.freshFormal"
        @answer-complete="methods.freshFormal(true)"
      />
    </div>
    <div class="main-right render-area">
      <div class="pre-view render-view" v-if="state.showingPdb.showing">
        <div class="renderer">
          <MolstarRender2
          :url="state.inPreview.previewMolecule.url"
          @click-rerender-pdb="rerenderPdb"
        />
        </div>
        <div class="statistics-indexs">
          <StatisticsIndexs
            :statistics="(state.inPreview.previewMolecule.statisticsIndexs as Metrics)"
          />
        </div>
      </div>
      <!-- <div class="formal-view render-view" v-else-if="state.inFormal.showing">
        <MolstarRender
          :url="currentFormalUrl"
          :smiles="state.inPreview.previewMolecule.smiles"
        />
        <div class="statistics-indexs">
          <StatisticsIndexs
          :statistics="(state.inFormal.formalMolecule.statisticsIndexs as Metrics)"
          />
        </div>
      </div> -->
      <div class="tint" v-else>
        Here will render the molecular structure based on Molar...
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import MolstarRender from "@/components/MolstarRender.vue";
import MolstarRender2 from "@/components/MolstarRender2.vue";
import RecommendationList from "@/components/RecommendationList.vue";
import PdbSeletcOrUpload from "@/components/PdbSeletcOrUpload.vue";
import StatisticsIndexs from "@/components/StatisticsIndexs.vue";
import { ref, onMounted, watch, reactive, computed, nextTick } from "vue";
import { MoleculeM, ChatRecommendationM, Metrics } from "@/models";
import DialogBox from "@/components/DialogBox.vue";
import ChatsHistory from "@/components/ChatsHistory.vue";
import Evaluate from "@/components/Evaluate.vue";

interface stateM {
  inPreview: {
    showing: boolean;
    previewMolecule: MoleculeM; // pdb or sdf
    previewPdb: MoleculeM; // pdb
    currentPdbUrl: string;
  };
  inFormal: {
    showing: boolean;
    formalMolecule: MoleculeM;
    isModified: boolean;
  };
  inPdbSelect: {
    showing: boolean;
  };
  showingPdb: {
    pdb: MoleculeM;
    showing: boolean;
  };
  activeTab: string;
}

const state: stateM = reactive({
  inPreview: {
    showing: false,
    previewMolecule: {} as MoleculeM,
    previewPdb: {} as MoleculeM,
    currentPdbUrl: "",
  },
  inFormal: {
    showing: false,
    formalMolecule: {} as MoleculeM,
    isModified: false,
  },
  inPdbSelect: {
    showing: true,
  },
  showingPdb: {
    pdb: {} as MoleculeM,
    showing: false,
  },
  activeTab: "preference",
});

const renderPdb = (mol: MoleculeM) => {
  state.inPreview.previewMolecule = mol;
  state.inPreview.previewPdb = mol;
  state.inPreview.currentPdbUrl = mol.url;
  state.showingPdb.pdb = mol;
  state.showingPdb.showing = true;
};

const exitPdbSelectAndEnterPreferenceSubmitPage = (mol: MoleculeM) => {
  state.inPdbSelect.showing = false;
  state.inFormal.showing = false;
  state.inPreview.showing = true;
};

const rerenderPdb = async () => {
  state.showingPdb.showing = false;
  await nextTick();
  state.inPreview.previewMolecule = state.inPreview.previewPdb;
  state.showingPdb.showing = true;
};

const uploadPdb = (molecule: MoleculeM) => {
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
</script>

<style lang="scss">
._chats {
  display: flex;
  width: 100%;
  height: 100%;
  .el-tabs__header {
    margin: 0;
  }
  .pdb-select-or-upload {
    position: absolute;
    width: 100%;
    height: 100%;
  }
  .chats-history {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 192px;
    height: 100%;
  }
  .main-left {
    width: 900px;
    height: 100%;
    background-color: white;
    .el-tabs {
      height: 100%;
    }
    .el-tabs__content {
      height: calc(100% - 40px);
      .el-tab-pane {
        height: 100%;
      }
    }
  }
  .main-right {
    width: calc(100% - 1092px);
    height: 100%;
    overflow-y: auto;
    .render-view {
      position: relative;
      width: 100%;
      height: 100%;
      .renderer {
        width: 100%;
        height: 600px;
      }
      .statistics-indexs {
        display: flex;
        flex-wrap: wrap;
        position: relative;
        width: 100%;
        min-height: calc(100% - 600px);
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
