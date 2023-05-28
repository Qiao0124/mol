<template>
  <svg width="160" height="160" :id="props.type"></svg>
</template>

<script lang="ts" setup>
//@ts-nocheck
import * as d3 from "d3";
import { ref, onMounted, defineProps, watch } from "vue";
// 在setup函数中可以使用D3库
const chartContainer = ref(null);
const props = defineProps(["type", "value"]);

function getMaximum(isOriginal: boolean) {
  switch (props.type) {
    case "num_atoms":
      return (Math.round(props.value / 100) + 1) * 100;
    case "num_bonds":
      return (Math.round(props.value / 100) + 1) * 100;
    case "num_rings":
      return (Math.round(props.value / 100) + 1) * 100;
    case "num_H_donors":
      return (Math.round(props.value / 100) + 1) * 100;
    case "num_H_acceptors":
      return (Math.round(props.value / 100) + 1) * 100;
    case "num_rotatable_bonds":
      return (Math.round(props.value / 100) + 1) * 100;
    case "QED":
      return 1;
    case "SA":
      return 1;
    case "LogP":
      return isOriginal ? 5 : 8;
  }
}

function getValue(isOriginal: boolean) {
  if (props.type == "LogP") {
    return isOriginal
      ? Number(props.value).toFixed(3)
      : Number(props.value + 3).toFixed(3);
  } else {
    return Number(props.value).toFixed(3);
  }
}

function getLabel() {
  switch (props.type) {
    case "num_atoms":
      return "Atoms Num";
    case "num_bonds":
      return "Bonds Num";
    case "num_rings":
      return "Rings Num";
    case "num_H_donors":
      return "H Donors Num";
    case "num_H_acceptors":
      return "H Acceptors Num";
    case "num_rotatable_bonds":
      return "Rotatable Bonds Num";
    case "QED":
      return "QED";
    case "SA":
      return "SA";
    case "LogP":
      return "LogP";
  }
}

function draw() {
  let tau = 2 * Math.PI;
  let width = 160;
  let height = 160;

  let arc = d3.arc().innerRadius(72).outerRadius(80).startAngle(0);

  let svg = d3.select(`#${props.type}`);
  let g = svg
    .append("g")
    .attr("transform", `translate(${width / 2}, ${height / 2})`);

  // Add the background arc, from 0 to 100% (tau).
  let background = g
    .append("path")
    .datum({ endAngle: tau })
    .style("fill", "#ddd")
    .attr("d", arc);

  // Set foreground arc to 0% to begin with.
  let foreground = g
    .append("path")
    .datum({ endAngle: 0 })
    .style("fill", "#409EFF")
    .style("cursor", "pointer")
    .attr("d", (d) => arc(d));

  // add text label on the bottom
  let txt1 = g
    .append("text")
    .attr("text-anchor", "middle")
    .attr("dy", "0em")
    .attr("fill", "#000")
    .attr("color", "#000")
    .attr("font-size", "12px")
    .attr("font-weight", "bold")
    .attr("font-family", "sans-serif")
    .style("cursor", "pointer")
    .on("mouseover", function () {
      foreground.style("fill", "#337ecc");
    })
    .on("mouseout", function () {
      foreground.style("fill", "#409EFF");
    })
    .text(getLabel());

  let txt2 = g
    .append("text")
    .attr("text-anchor", "middle")
    .attr("dy", "1.5em")
    .attr("fill", "#000")
    .attr("color", "#000")
    .attr("font-size", "12px")
    .attr("font-weight", "bold")
    .attr("font-family", "sans-serif")
    .style("cursor", "pointer")
    .on("mouseover", function () {
      foreground.style("fill", "#337ecc");
    })
    .on("mouseout", function () {
      foreground.style("fill", "#409EFF");
    })
    .text(getValue(true) + "/" + getMaximum(true));

  foreground
    .transition()
    .duration(1250)
    .attrTween("d", arcTween((getValue() / getMaximum(false)) * tau));

  foreground
    .on("mouseover", function () {
      d3.select(this).style("fill", "#337ecc");
    })
    .on("mouseout", function () {
      d3.select(this).style("fill", "#409EFF");
    });

  function arcTween(newAngle) {
    return (d) => {
      let interpolate = d3.interpolate(d.endAngle, newAngle);

      return (t) => ((d.endAngle = interpolate(t)), arc(d));
    };
  }
}

onMounted(() => {
  draw();
});

watch(
  () => props.value,
  () => {
    d3.select(`#${props.type}`).selectAll("*").remove();
    draw();
  }
);
</script>

<style lang="scss" scoped>
svg {
  margin: 16px;
  background: white;
}
</style>
