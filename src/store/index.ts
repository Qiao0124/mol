// stores/counter.js
import { defineStore } from "pinia";

export const useMolStore = defineStore("molStore", {
  state: () => {
    return {
      viewer: null,
      molStack: [],
      pdbId: 0,
      timestamp: "000000",
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
    setCurrentPdbAndTimestamp(pdbId: number, timestamp: string) {
      this.pdbId = pdbId;
      this.timestamp = timestamp;
    },
    getTimestamp() {
      return this.timestamp;
    },
    getCurrentPdbId() {
      return this.pdbId;
    },
  },
});
