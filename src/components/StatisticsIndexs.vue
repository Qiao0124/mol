<template>
  <div class="_statistics-index">
    <div class="norange-list"></div>
    <div class="range-list">
      <div class="Vina range" id="Vina"></div>
      <div class="Lipinski range" id="Lipinski"></div>
      <div class="QED range" id="QED"></div>
      <div class="SA range" id="SA"></div>
      <div class="num_atoms range" id="num_atoms"></div>
      <div class="num_bonds range" id="num_bonds"></div>
      <div class="num_rings range" id="num_rings"></div>
      <div class="num_benzene_rings range" id="num_benzene_rings"></div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import * as echarts from "echarts";
import { ref, onMounted, defineProps, watch, reactive } from "vue";
import { statisticsIndexsM } from "@/models";
import * as api from "@/api";

const chartContainer = ref(null);
const props = defineProps<{ statisticsUrl?: string }>();
const state = reactive({
  statistics: {
    num_atoms: 0,
    num_bonds: 0,
    num_rings: 0,
    num_benzene_rings: 0,
    Vina: 0,
    Lipinski: 0,
    QED: 0,
    SA: 0,
  },
});

function getMaximum(label: string) {
  switch (label) {
    case "num_atoms":
      return (Math.floor(state.statistics.num_atoms / 50) + 1) * 50;
    case "num_bonds":
      return (Math.floor(state.statistics.num_bonds / 50) + 1) * 50;
    case "num_rings":
      return (Math.floor(state.statistics.num_rings / 50) + 1) * 50;
    case "num_benzene_rings":
      return (Math.floor(state.statistics.num_benzene_rings / 50) + 1) * 50;
    case "QED":
      return 1;
    case "SA":
      return 1;
    case "Vina":
      return 5;
    case "Lipinski":
      return 5;
    default:
      return 1;
  }
}

function checkIfShowRange(label: string) {
  if (
    label == "num_atoms" ||
    label == "num_bonds" ||
    label == "num_rings" ||
    label == "num_benzene_rings" ||
    label == "Vina"
  ) {
    return false;
  } else {
    return true;
  }
}

function drawRange(
  domId: string,
  value: number,
  minVal: number,
  maxVal: number,
  label: string
) {
  const chartDom = document.getElementById(domId);
  chartDom?.removeAttribute("_echarts_instance_");
  const myChart = echarts.init(chartDom);
  const option = {
    series: [
      {
        type: "gauge",
        min: minVal,
        max: maxVal,
        progress: {
          show: true,
          width: 5,
        },
        axisLine: {
          lineStyle: {
            width: 5,
          },
        },
        axisTick: {
          show: false,
        },
        splitLine: {
          length: 6,
          lineStyle: {
            width: 1,
            color: "#999",
          },
        },
        axisLabel: {
          distance: 7,
          color: "#999",
          fontSize: 8,
        },
        anchor: {
          show: true,
          showAbove: true,
          size: 10,
          itemStyle: {
            borderWidth: 3,
          },
        },
        title: {
          show: true,
          offsetCenter: [0, "90%"],
          fontSize: 12,
        },
        detail: {
          valueAnimation: true,
          fontSize: 16,
          offsetCenter: [0, "58%"],
        },
        data: [
          {
            value: value,
            name: label,
          },
        ],
      },
    ],
  };

  option && myChart.setOption(option);
}

onMounted(async () => {
  if (!props.statisticsUrl) return;
  state.statistics = await api.reqGetStatistics(props.statisticsUrl);
  drawRange(
    "num_atoms",
    Number(state.statistics.num_atoms.toFixed(3)),
    0,
    getMaximum("num_atoms"),
    "Atoms Num"
  );
  drawRange(
    "num_bonds",
    Number(state.statistics.num_bonds.toFixed(3)),
    0,
    getMaximum("num_bonds"),
    "Bonds Num"
  );
  drawRange(
    "num_rings",
    Number(state.statistics.num_rings.toFixed(3)),
    0,
    getMaximum("num_rings"),
    "Rings Num"
  );
  drawRange(
    "num_benzene_rings",
    Number(state.statistics.num_benzene_rings.toFixed(3)),
    0,
    getMaximum("num_benzene_rings"),
    "Benzene Rings Num"
  );
  drawRange(
    "Vina",
    Number(state.statistics.Vina.toFixed(3)),
    -20,
    getMaximum("Vina"),
    "Vina Score"
  );
  drawRange(
    "Lipinski",
    Number(state.statistics.Lipinski.toFixed(3)),
    0,
    getMaximum("Lipinski"),
    "Lipinski"
  );
  drawRange(
    "QED",
    Number(state.statistics.QED.toFixed(3)),
    0,
    getMaximum("QED"),
    "QED"
  );
  drawRange(
    "SA",
    Number(state.statistics.SA.toFixed(3)),
    0,
    getMaximum("SA"),
    "SA"
  );
});

watch(
  () => props.statisticsUrl,
  async () => {
    if (!props.statisticsUrl) return;
    state.statistics = await api.reqGetStatistics(props.statisticsUrl);
    console.log(state.statistics);
    drawRange(
      "num_atoms",
      Number(state.statistics.num_atoms.toFixed(3)),
      0,
      getMaximum("num_atoms"),
      "Atoms Num"
    );
    drawRange(
      "num_bonds",
      Number(state.statistics.num_bonds.toFixed(3)),
      0,
      getMaximum("num_bonds"),
      "Bonds Num"
    );
    drawRange(
      "num_rings",
      Number(state.statistics.num_rings.toFixed(3)),
      0,
      getMaximum("num_rings"),
      "Rings Num"
    );
    drawRange(
      "num_benzene_rings",
      Number(state.statistics.num_benzene_rings.toFixed(3)),
      0,
      getMaximum("num_benzene_rings"),
      "Benzene Rings Num"
    );
    drawRange(
      "Vina",
      Number(state.statistics.Vina.toFixed(3)),
      -20,
      getMaximum("Vina"),
      "Vina Score"
    );
    drawRange(
      "Lipinski",
      Number(state.statistics.Lipinski.toFixed(3)),
      0,
      getMaximum("Lipinski"),
      "Lipinski"
    );
    drawRange(
      "QED",
      Number(state.statistics.QED.toFixed(3)),
      0,
      getMaximum("QED"),
      "QED"
    );
    drawRange(
      "SA",
      Number(state.statistics.SA.toFixed(3)),
      0,
      getMaximum("SA"),
      "SA"
    );
  }
);
</script>

<style lang="scss" scoped>
._statistics-index {
  box-sizing: border-box;
  position: relative;
  .norange {
    width: 100%;
    height: 30px;
  }
  .range-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    .range {
      width: 172px;
      height: 185px;
      background: white;
    }
  }
}
</style>
