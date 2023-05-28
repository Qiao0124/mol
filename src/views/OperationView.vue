<template>
  <div class="_operation-view">
    <div class="left">
      <div class="select" v-if="!state.inFormal.showing">
        <div class="title">Select</div>
        <div
          class="molecule"
          v-for="molecule in state.molecules"
          :key="molecule.id"
        >
          <div class="name">{{ molecule.name }}</div>
          <div class="btns">
            <button class="preview-btn" @click="methods.preview(molecule)">
              Preview
            </button>
            <button
              class="formalview-btn"
              @click="methods.selectMolecule(molecule)"
            >
              Select
            </button>
          </div>
        </div>
      </div>
      <div class="dialog-box" v-else>
        <dialog-box
          @return-to-select="methods.returnToSelect"
          @switch-molecular="methods.freshFormal"
          @answer-complete="methods.freshFormal(true)"
        />
      </div>
    </div>
    <div class="right 3drender">
      <div class="pre-view render-view" v-if="state.inPreview">
        <MolstarRender :url="currentPreviewUrl" />
        <div class="statistics-indexs">
          <StatisticsIndexs
            v-for="(statistic, key, index) in currentStatisticsIndexs"
            :key="index"
            :type="key"
            :value="statistic"
          />
        </div>
      </div>
      <div class="formal-view render-view" v-else-if="state.inFormal.showing">
        <MolstarRender :url="currentFormalUrl" />
        <div class="statistics-indexs">
          <StatisticsIndexs
            v-for="(statistic, key, index) in currentStatisticsIndexs"
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
import DialogBox from "@/components/DialogBox.vue";
import MolstarRender from "@/components/MolstarRender.vue";
import StatisticsIndexs from "@/components/StatisticsIndexs.vue";
import { reactive, computed } from "vue";

const state = reactive({
  molecules: [
    {
      name: "add_0",
      before: "before_add_0.sdf",
      after: "after_add_0.sdf",
      id: 1,
      statistics_before: {
        num_atoms: 28,
        num_bonds: 28,
        num_rings: 1,
        num_H_donors: 4,
        num_H_acceptors: 5,
        num_rotatable_bonds: 7,
        QED: 0.39576499672758714,
        SA: 0.76,
        LogP: 0.5856999999999999,
      },
      statistics_after: {
        num_atoms: 36,
        num_bonds: 37,
        num_rings: 2,
        num_H_donors: 4,
        num_H_acceptors: 6,
        num_rotatable_bonds: 10,
        QED: 0.3667695443608393,
        SA: 0.77,
        LogP: 2.0349,
      },
    },
    {
      name: "add_1",
      before: "before_add_1.sdf",
      after: "after_add_1.sdf",
      id: 2,
      statistics_before: {
        num_atoms: 18,
        num_bonds: 18,
        num_rings: 1,
        num_H_donors: 2,
        num_H_acceptors: 3,
        num_rotatable_bonds: 4,
        QED: 0.6177558493971933,
        SA: 0.87,
        LogP: 1.0635999999999992,
      },
      statistics_after: {
        num_atoms: 19,
        num_bonds: 19,
        num_rings: 1,
        num_H_donors: 2,
        num_H_acceptors: 3,
        num_rotatable_bonds: 4,
        QED: 0.6520638160749629,
        SA: 0.86,
        LogP: 1.7169999999999996,
      },
    },
    {
      name: "del_0",
      before: "before_del_0.sdf",
      after: "after_del_0.sdf",
      id: 3,
      statistics_before: {
        num_atoms: 40,
        num_bonds: 41,
        num_rings: 2,
        num_H_donors: 4,
        num_H_acceptors: 6,
        num_rotatable_bonds: 10,
        QED: 0.19513088951938565,
        SA: 0.72,
        LogP: 2.5912999999999995,
      },
      statistics_after: {
        num_atoms: 36,
        num_bonds: 37,
        num_rings: 2,
        num_H_donors: 4,
        num_H_acceptors: 6,
        num_rotatable_bonds: 10,
        QED: 0.3667695443608393,
        SA: 0.77,
        LogP: 2.0349,
      },
    },
    {
      name: "del_1",
      before: "before_del_1.sdf",
      after: "after_del_1.sdf",
      id: 4,
      statistics_before: {
        num_atoms: 37,
        num_bonds: 39,
        num_rings: 3,
        num_H_donors: 3,
        num_H_acceptors: 6,
        num_rotatable_bonds: 11,
        QED: 0.35889924030885445,
        SA: 0.75,
        LogP: 2.875,
      },
      statistics_after: {
        num_atoms: 34,
        num_bonds: 36,
        num_rings: 3,
        num_H_donors: 3,
        num_H_acceptors: 6,
        num_rotatable_bonds: 10,
        QED: 0.4107814551480482,
        SA: 0.79,
        LogP: 1.8503999999999996,
      },
    },
    {
      name: "del_2",
      before: "before_del_2.sdf",
      after: "after_del_2.sdf",
      id: 5,
      statistics_before: {
        num_atoms: 25,
        num_bonds: 26,
        num_rings: 2,
        num_H_donors: 3,
        num_H_acceptors: 5,
        num_rotatable_bonds: 7,
        QED: 0.6440268538776837,
        SA: 0.81,
        LogP: 1.218799999999999,
      },
      statistics_after: {
        num_atoms: 22,
        num_bonds: 23,
        num_rings: 2,
        num_H_donors: 2,
        num_H_acceptors: 4,
        num_rotatable_bonds: 6,
        QED: 0.7881564244389874,
        SA: 0.82,
        LogP: 1.5205999999999995,
      },
    },
    {
      name: "rep_0",
      before: "before_rep_0.sdf",
      after: "after_rep_0.sdf",
      id: 6,
      statistics_before: {
        num_atoms: 36,
        num_bonds: 37,
        num_rings: 2,
        num_H_donors: 4,
        num_H_acceptors: 6,
        num_rotatable_bonds: 10,
        QED: 0.3667695443608393,
        SA: 0.77,
        LogP: 2.0349,
      },
      statistics_after: {
        num_atoms: 34,
        num_bonds: 35,
        num_rings: 2,
        num_H_donors: 4,
        num_H_acceptors: 6,
        num_rotatable_bonds: 9,
        QED: 0.4119489508108998,
        SA: 0.77,
        LogP: 1.5525000000000002,
      },
    },
    {
      name: "rep_1",
      before: "before_rep_1.sdf",
      after: "after_rep_1.sdf",
      id: 7,
      statistics_before: {
        num_atoms: 36,
        num_bonds: 37,
        num_rings: 2,
        num_H_donors: 4,
        num_H_acceptors: 6,
        num_rotatable_bonds: 10,
        QED: 0.3667695443608393,
        SA: 0.77,
        LogP: 2.0349,
      },
      statistics_after: {
        num_atoms: 36,
        num_bonds: 37,
        num_rings: 2,
        num_H_donors: 4,
        num_H_acceptors: 6,
        num_rotatable_bonds: 10,
        QED: 0.3564530636525713,
        SA: 0.77,
        LogP: 1.7561999999999989,
      },
    },
    {
      name: "rep_2",
      before: "before_rep_2.sdf",
      after: "after_rep_2.sdf",
      id: 8,
      statistics_before: {
        num_atoms: 21,
        num_bonds: 21,
        num_rings: 1,
        num_H_donors: 3,
        num_H_acceptors: 4,
        num_rotatable_bonds: 7,
        QED: 0.3938922242578155,
        SA: 0.75,
        LogP: 0.8220999999999992,
      },
      statistics_after: {
        num_atoms: 21,
        num_bonds: 21,
        num_rings: 1,
        num_H_donors: 3,
        num_H_acceptors: 4,
        num_rotatable_bonds: 8,
        QED: 0.3736372424424016,
        SA: 0.81,
        LogP: 0.698499999999999,
      },
    },
  ],
  previewMolecule: null,
  selectedMolecule: null,
  inPreview: false,
  inFormal: {
    showing: false,
    isModified: false,
  },
});

const methods = {
  selectMolecule(molecule: any) {
    state.selectedMolecule = molecule;
    state.inFormal.showing = true;
    state.inPreview = false;
  },
  preview(molecule: any) {
    state.previewMolecule = molecule;
    state.inPreview = true;
    state.inFormal.showing = false;
  },
  tint() {
    state.inPreview = false;
    state.inFormal.showing = false;
  },
  returnToSelect() {
    state.inPreview = false;
    state.inFormal.showing = false;
  },
  async freshFormal(isModified: boolean) {
    state.inFormal.isModified = isModified;
  },
};

const currentFormalUrl = computed(() => {
  if (state.inFormal.isModified) {
    return (
      "./examples/" +
      state.selectedMolecule.name +
      "/" +
      state.selectedMolecule.after
    );
  } else {
    return (
      "./examples/" +
      state.selectedMolecule.name +
      "/" +
      state.selectedMolecule.before
    );
  }
});

const currentPreviewUrl = computed(() => {
  return (
    "./examples/" +
    state.previewMolecule.name +
    "/" +
    state.previewMolecule.before
  );
});

const currentStatisticsIndexs = computed(() => {
  if (state.inPreview) {
    return state.previewMolecule.statistics_before;
  }
  if (state.inFormal.isModified) {
    return state.selectedMolecule.statistics_after;
  } else {
    return state.selectedMolecule.statistics_before;
  }
});
</script>

<style lang="scss" scoped>
._operation-view {
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  padding: 16px;
  .left {
    box-sizing: border-box;
    padding: 16px;
    width: 49.5%;
    height: 100%;
    background: white;
    border-radius: 16px;
    .select {
      width: 100%;
      height: 100%;
      .title {
        text-align: left;
        font-size: 36px;
        font-weight: 500;
        margin-bottom: 12px;
      }
      .molecule {
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        height: 48px;
        padding: 16px;
        border-bottom: 1px solid var(--primary-light5);
        background: var(--primary-light9);
        .name {
          font-size: 16px;
          pointer-events: none;
        }
        .preview-btn {
          width: 70px;
          height: 28px;
          border-radius: 6px;
          border-color: transparent;
          background: var(--primary);
          margin-right: 12px;
          color: white;

          cursor: pointer;
        }
        .formalview-btn {
          width: 70px;
          height: 28px;
          border-radius: 6px;
          border-color: transparent;
          background: var(--primary-dark);
          color: white;

          cursor: pointer;
        }
        &:hover {
          background: var(--primary-light8);
        }
      }
    }
    .dialog-box {
      width: 100%;
      height: 100%;
    }
  }
  .right {
    box-sizing: border-box;
    padding: 10px;
    width: 49.5%;
    height: 100%;
    background: white;
    overflow-y: auto;
    border-radius: 16px;
    .render-view {
      position: relative;
      width: 100%;
      height: 58%;
      .statistics-indexs {
        width: 100%;
        box-sizing: border-box;
        display: flex;
        flex-wrap: wrap;
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
