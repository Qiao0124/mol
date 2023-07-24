<template>
  <div class="_molstar-render" ref="_molstarRender"></div>
  <button @click="clearAllSdfs">Clear all sdfs</button>
</template>

<script lang="ts" setup>
import * as molstar from "@/utils/molstar.js";
import { useMolStore } from "@/store";
import { defineProps, onMounted, reactive, ref, watch, defineEmits } from "vue";

const molStore = useMolStore();
const emits = defineEmits(["click-rerender-pdb"])

const props = defineProps({
  url: {
    type: String,
    default: "http://localhost:8080/examples/add_0/before_add_0.sdf",
  },
  smiles: {
    type: String,
    default: "C1=CC=C(C=C1)C(=O)O",
  },
});

const examplePdbUrl =
  "http://localhost:8080/examples/protein_ligand/protein_ligand_0.pdb";

const exampleSdfUrl = "http://localhost:8080/examples/add_0/before_add_0.sdf";

let _molstarRender = ref(null);
let urlsRendered = reactive([]);
let viewerOut;

function getParam(name, regex) {
  var r = new RegExp(name + "=" + "(" + regex + ")[&]?", "i");
  return decodeURIComponent(
    ((window.location.search || "").match(r) || [])[1] || ""
  );
}

var debugMode = getParam("debug-mode", "[^&]+").trim() === "1";
if (debugMode) molstar.setDebugMode(debugMode);

var timingMode = getParam("timing-mode", "[^&]+").trim() === "1";
if (timingMode) molstar.setTimingMode(timingMode);

var hideControls = getParam("hide-controls", "[^&]+").trim() === "1";
var collapseLeftPanel = getParam("collapse-left-panel", "[^&]+").trim() === "1";
var pdbProvider = getParam("pdb-provider", "[^&]+").trim().toLowerCase();
var emdbProvider = getParam("emdb-provider", "[^&]+").trim().toLowerCase();
var mapProvider = getParam("map-provider", "[^&]+").trim().toLowerCase();
var pixelScale = getParam("pixel-scale", "[^&]+").trim();
var pickScale = getParam("pick-scale", "[^&]+").trim();
var pickPadding = getParam("pick-padding", "[^&]+").trim();
var disableWboit = getParam("disable-wboit", "[^&]+").trim() === "1";
var enableDpoit = getParam("enable-dpoit", "[^&]+").trim() === "1";
var preferWebgl1 = getParam("prefer-webgl1", "[^&]+").trim() === "1" || void 0;
var allowMajorPerformanceCaveat =
  getParam("allow-major-performance-caveat", "[^&]+").trim() === "1";
var powerPreference = getParam("power-preference", "[^&]+")
  .trim()
  .toLowerCase();
const options = {
  layoutShowControls: false,
  layoutShowRemoteState: false,
  layoutShowSequence: false,
  layoutShowLeftPanel: false,
  layoutShowLog: false,
  viewportShowExpand: true,
  viewportShowControls: true,
  viewportShowSettings: true,
  collapseLeftPanel: true,
  collapseRightPanel: false,
  pdbProvider: "pdbe",
  emdbProvider: "pdbe",
  volumeStreamingDisabled: true,
  pixelScale: 1,
  pickScale: 0.25,
  pickPadding: 1,
  enableWboit: false, // use default value if disable-wboit is not set
  enableDpoit: true,
  preferWebgl1: true,
  allowMajorPerformanceCaveat: true,
  powerPreference: "high-performance",
  // customFormats: 自定义格式，一个数组，包含自定义格式的名称和数据格式提供程序的键值对。
  // extensions: 扩展插件的名称数组，列出了当前可用的扩展插件。
  // layoutIsExpanded: 是否展开布局，默认为 true，表示默认情况下布局是展开的。
  // layoutShowControls: 是否显示布局控件，默认为 true，表示默认情况下布局控件是可见的。
  // layoutShowRemoteState: 是否显示远程状态，默认为 true，表示默认情况下远程状态是可见的。
  // layoutControlsDisplay: 布局控件的显示方式，默认为 'reactive'，表示默认情况下布局控件以响应式方式显示。
  // layoutShowSequence: 是否显示序列，默认为 true，表示默认情况下序列是可见的。
  // layoutShowLog: 是否显示日志，默认为 true，表示默认情况下日志是可见的。
  // layoutShowLeftPanel: 是否显示左侧面板，默认为 true，表示默认情况下左侧面板是可见的。
  // collapseLeftPanel: 是否折叠左侧面板，默认为 false，表示默认情况下左侧面板是展开的。
  // collapseRightPanel: 是否折叠右侧面板，默认为 false，表示默认情况下右侧面板是展开的。
  // disableAntialiasing: 是否禁用抗锯齿，默认根据 PluginConfig.General.DisableAntialiasing.defaultValue 的值来确定。
  // pixelScale: 像素缩放值，默认根据 PluginConfig.General.PixelScale.defaultValue 的值来确定。
  // pickScale: 选择缩放值，默认根据 PluginConfig.General.PickScale.defaultValue 的值来确定。
  // pickPadding: 选择填充值，默认根据 PluginConfig.General.PickPadding.defaultValue 的值来确定。
  // enableWboit: 是否启用 WBOIT，默认根据 PluginConfig.General.EnableWboit.defaultValue 的值来确定。
  // enableDpoit: 是否启用 DPOIT，默认根据 PluginConfig.General.EnableDpoit.defaultValue 的值来确定。
  // preferWebgl1: 是否优先使用 WebGL1，默认根据 PluginConfig.General.PreferWebGl1.defaultValue 的值来确定。
  // allowMajorPerformanceCaveat: 是否允许主要性能警告，默认根据 PluginConfig.General.AllowMajorPerformanceCaveat.defaultValue 的值来确定。
  // powerPreference: 电源偏好，默认根据 PluginConfig.General.PowerPreference.defaultValue 的值来确定。
  // viewportShowExpand: 是否显示视口展开按钮，默认根据 PluginConfig.Viewport.ShowExpand.defaultValue 的值来确定。
  // viewportShowControls: 是否显示视口控件，默认根据 PluginConfig.Viewport.ShowControls.defaultValue 的值来确定。
  // viewportShowSettings: 是否显示视口设置按钮，默认根据 PluginConfig.Viewport.ShowSettings.defaultValue 的值来确定。
  // viewportShowSelectionMode: 是否显示选择模式按钮，默认根据 PluginConfig.Viewport.ShowSelectionMode.defaultValue 的值来确定。
  // viewportShowAnimation: 是否显示动画按钮，默认根据 PluginConfig.Viewport.ShowAnimation.defaultValue 的值来确定。
  // viewportShowTrajectoryControls: 是否显示轨迹控件，默认根据 PluginConfig.Viewport.ShowTrajectoryControls.defaultValue 的值来确定。
  // pluginStateServer: 插件状态服务器，默认根据 PluginConfig.State.DefaultServer.defaultValue 的值来确定。
  // volumeStreamingServer: 体积流服务器，默认根据 PluginConfig.VolumeStreaming.DefaultServer.defaultValue 的值来确定。
  // volumeStreamingDisabled: 是否禁用体积流，默认根据 PluginConfig.VolumeStreaming.Enabled.defaultValue 的值来确定。
  // pdbProvider: PDB 提供程序，默认根据 PluginConfig.Download.DefaultPdbProvider.defaultValue 的值来确定。
  // emdbProvider: EMDB 提供程序，默认根据 PluginConfig.Download.DefaultEmdbProvider.defaultValue 的值来确定。
  // saccharideCompIdMapType: 糖类 CompId 映射类型，默认为 'default'，表示默认情况下使用默认的糖类 CompId 映射。
  // volumesAndSegmentationsDefaultServer: 体积和分割默认服务器配置，默认根据 VolsegVolumeServerConfig.DefaultServer.defaultValue 的值来确定。
};

async function initViewer(target: string | HTMLElement) {
  let viewer = await molstar.Viewer.create(target, options);
  return viewer;
}

async function addNewMol() {
  await viewerOut.loadStructureFromUrl(exampleSdfUrl, "sdf");
}

function clearAllSdfs() {
  emits("click-rerender-pdb", urlsRendered[0]);
}

onMounted(async () => {
  let viewerReturned = await initViewer(
    _molstarRender.value as unknown as HTMLElement
  );
  viewerOut = viewerReturned;
  molStore.setViewer(viewerReturned);
  let viewer = molStore.getViewer();
  urlsRendered.push(props.url);
  await viewerOut.loadStructureFromUrl(props.url, "pdb");
});

watch(
  () => props.url,
  async (newUrl, oldUrl) => {
    if (urlsRendered.includes(newUrl)) {
      return;
    }
    urlsRendered.push(newUrl);
    await viewerOut.loadStructureFromUrl(newUrl, "sdf");
  }
);
</script>

<style lang="scss">
._molstar-render {
  position: relative;
  width: 100%;
  height: 100%;
  .msp-plugin-content {
    position: absolute;
  }
}
</style>
