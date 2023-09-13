<template>
  <div class="_pdb-seletc-or-upload">
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
      <div class="pdb-upload">
        or you can upload a pdb file
        <input type="file" @change="getFile($event)" accept=".pdb" />
      </div>
      <div class="btns">
        <div class="select-confirm">
          <button
            @click.once="selectPdb"
            v-loading="state.pending"
            :disabled="!state.pdbSelected"
          >
            select
          </button>
        </div>
        <div class="upload-confirm">
          <button
            @click.once="uploadPdb"
            v-loading="state.pending"
            :disabled="!state.pdbUploaded || true"
          >
            upload
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref, onMounted, defineEmits } from "vue";
import * as api from "@/api";
import { MoleculeM } from "@/models";
import { useMolStore } from "@/store";
import { storeToRefs } from "pinia";

const molStore = useMolStore();
const emits = defineEmits(["pdb-uploaded", "pdb-selected"]);

interface stateM {
  pdbs: MoleculeM[];
  pdbSelected: MoleculeM | null;
  pdbUploaded: any;
  pending: boolean;
}

const state: stateM = reactive({
  pdbs: [],
  pdbSelected: null,
  pdbUploaded: null,
  pending: false,
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
  molStore.setCurrentPdbAndTimestamp(
    state.pdbSelected?.name as string,
    Date.now().toString()
  );
  await api.reqConfirmPdbAndGetInitialMols(
    molStore.getCurrentPdbId(),
    molStore.getTimestamp(),
    molStore.getCurrentPdbId()
  );
  state.pending = false;
  emits("pdb-selected", state.pdbSelected);
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
