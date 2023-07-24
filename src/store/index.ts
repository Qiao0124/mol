// stores/counter.js
import { defineStore } from "pinia";

export const useMolStore = defineStore("mol", {
  state: () => {
    return {
      viewer: null,
      molStack: [],
    };
  },
  actions: {
    setViewer(viewer: any) {
      this.viewer = viewer;
    },
    getViewer() {
      return this.viewer;
    },
    clearViewer() {
      this.viewer = null;
    },
  },
});
