<template>
  <div class="_pdb-seletc-or-upload" v-loading="!state.ready">
    <div class="inner-window">
      <div class="pdb-selections">
        <el-select
          v-model="state.pdbSelected"
          class="m-2"
          placeholder="Select"
          size="large"
          value-key="name"
        >
          <el-option
            v-for="pdb in state.pdbs"
            :key="pdb.name"
            :label="pdb.name"
            :value="pdb"
          />
        </el-select>
      </div>
      <FadeTransition>
        <div class="pdb-upload" v-if="!state.pending">
          or you can upload a pdb file
          <input type="file" @change="getFile($event)" accept=".pdb" />
        </div>
      </FadeTransition>
      <FadeTransition>
        <div class="btns" v-if="!state.pending">
          <div class="select-confirm">
            <button @click.once="selectPdb" :disabled="!state.pdbSelected">
              select
            </button>
          </div>
          <div class="upload-confirm">
            <button
              @click.once="uploadPdb"
              :disabled="!state.pdbUploaded || true"
            >
              upload
            </button>
          </div>
        </div>
        <Progress :finish="state.finish" v-else />
      </FadeTransition>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref, onMounted, defineEmits } from "vue";
import * as api from "@/api";
import { MoleculeM } from "@/models";
import { useMolStore } from "@/store";
import { storeToRefs } from "pinia";
import Progress from "@/components/Progress.vue";
import FadeTransition from "@/components/FadeTransition.vue";

const molStore = useMolStore();
const emits = defineEmits(["pdb-uploaded", "pdb-selected", "sdfs-got"]);

interface stateM {
  ready: boolean;
  pdbs: MoleculeM[];
  pdbSelected: MoleculeM | null;
  pdbUploaded: any;
  pending: boolean;
  finish: boolean;
}

const state: stateM = reactive({
  ready: false,
  pdbs: [],
  pdbSelected: null,
  pdbUploaded: null,
  pending: false,
  finish: false,
});

const getFile = (event) => {
  const file = event.target.files[0];

  //上传类型判断
  var imgName = file.name;
  var idx = imgName.lastIndexOf(".");
  if (idx != -1) {
    var ext = imgName.substr(idx + 1).toUpperCase();
    ext = ext.toLowerCase();
    if (ext == "pdb") {
      state.pdbUploaded = file;
    }
  } else {
    alert("wrong file type");
  }
};

const selectPdb = async () => {
  state.pending = true;
  emits("pdb-selected", state.pdbSelected);
  molStore.setCurrentPdbAndTimestamp(
    state.pdbSelected?.name as string,
    Date.now().toString()
  );
  await api.reqConfirmPdbAndGetInitialMols(
    molStore.getCurrentPdbId(),
    molStore.getTimestamp(),
    molStore.getCurrentPdbId()
  );
  state.finish = true;
  setTimeout(() => {
    emits("sdfs-got");
    state.pending = false;
  }, 600);
};

const uploadPdb = () => {
  state.pending = true;
  setTimeout(() => {
    state.pending = false;
    emits("pdb-uploaded");
  }, 1000);
};

onMounted(async () => {
  const pdbs = await api.reqGetPdbs();
  state.pdbs = pdbs;
  state.ready = true;
});
</script>

<style lang="scss" scoped>
._pdb-seletc-or-upload {
  box-sizing: border-box;
  position: relative;
  width: 100%;
  height: 100%;
  padding: 16px;
  .pdb-selections {
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: space-around;
    min-height: 200px;
    flex-wrap: wrap;
    padding: 24px 12px;
    border-bottom: 0.5px solid #ddd;
    .selection {
      width: 150px;
      height: 150px;
      overflow: hidden;
      word-break: normal;
      line-break: anywhere;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      .pdb-name {
        width: 100%;
        height: 120px;
      }
    }
  }
  .pdb-upload {
    box-sizing: border-box;
    padding: 24px 12px;
    border-bottom: 0.5px solid #ddd;
  }
  .btns {
    box-sizing: border-box;
    display: flex;
    justify-content: space-around;
    padding: 24px 12px;
    .select-confirm {
      button {
        width: 70px;
        height: 35px;
      }
    }
    .upload-confirm {
      button {
        width: 70px;
        height: 35px;
      }
    }
  }
}
</style>
