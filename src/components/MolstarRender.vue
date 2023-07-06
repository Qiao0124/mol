<template>
  <div id='_molstar-parent'>
    <div class="screenshot">
      <MoleculeStructure
        :id="'screenshot'"
        :structure="props.smiles"
        :width="160"
        :height="160"
        :svgMode="true"
      />
    </div>
    <canvas id='molstar-canvas'></canvas>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch } from "vue";
import { DefaultPluginSpec, PluginSpec } from "molstar/lib/mol-plugin/spec";
import { PluginContext } from "molstar/lib/mol-plugin/context";
import { PluginConfig } from "molstar/lib/mol-plugin/config";
import { ColorNames } from 'molstar/lib/mol-util/color/names';
import { PluginCommands } from 'molstar/lib/mol-plugin/commands';
import MoleculeStructure from "./MoleculeStructure.vue";

let viewerRef = ref();
const options = {
  layoutIsExpanded: false,
  layoutShowControls: false,
  layoutShowRemoteState: false,
  layoutShowSequence: true,
  layoutShowLog: false,
  layoutShowLeftPanel: true,

  viewportShowExpand: true,
  viewportShowSelectionMode: false,
  viewportShowAnimation: false,

  pdbProvider: "rcsb",
  emdbProvider: "rcsb",
};
const props = defineProps({
  url: {
    type: String,
    default: "http://localhost:8080/examples/before_add_0.sdf",
  },
  smiles: {
    type: String,
    default: "C1=CC=C(C=C1)C(=O)O",
  },
});

const MySpec: PluginSpec = {
  ...DefaultPluginSpec(),
  config: [
      [PluginConfig.VolumeStreaming.Enabled, false]
  ]
}

async function init(url: string) {
  const plugin = new PluginContext(MySpec);
  await plugin.init();

  const canvas = <HTMLCanvasElement> document.getElementById('molstar-canvas');
  const parent = <HTMLDivElement> document.getElementById('_molstar-parent');

  if (!plugin.initViewer(canvas, parent)) {
    console.error("Failed to init Mol* ");
    return;
  }

  const data = await plugin.builders.data.download({ url: url }, { state: { isGhost: true } });
  console.log("url", url)
  let trajectory
  if(url.endsWith("sdf")){
   trajectory = await plugin.builders.structure.parseTrajectory(data, "sdf");
  } else if (url.endsWith("pdb")){
   trajectory = await plugin.builders.structure.parseTrajectory(data, "pdb");
  } else {
   trajectory = await plugin.builders.structure.parseTrajectory(data, "mmcif");
  }
  await plugin.builders.structure.hierarchy.applyPreset(trajectory, 'default');
}
onMounted(() => {
  init(props.url)
})

watch(
  () => props.url,
  (newVal) => {
    const canvas = <HTMLCanvasElement> document.getElementById('molstar-canvas');
    const parent = <HTMLDivElement> document.getElementById('_molstar-parent');
    canvas.remove()
    let canvas_2 = document.createElement('canvas');
    canvas_2.id = 'molstar-canvas';
    canvas_2.style.position = 'absolute';
    canvas_2.style.top = '0';
    canvas_2.style.left = '0';
    canvas_2.style.right = '0';
    canvas_2.style.bottom = '0';
    parent.appendChild(canvas_2);
    init(newVal)
  }
)
</script>

<style lang="scss" scoped>
#_molstar-parent{
  position: relative;
  width: 100%;
  height: 100%;
}
#molstar-canvas {
  width: 100%;
  fill: black;
}
.screenshot {
  position: absolute;
}
</style>
