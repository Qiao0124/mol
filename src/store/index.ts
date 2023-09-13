// stores/counter.js
import { defineStore } from "pinia";
import * as model from "@/models";

export const useMolStore = defineStore("molStore", {
  state: () => {
    return {
      viewer: null,
      pdbId: "00",
      checkPrompt: false,
      timestamp: "000000",
      csrfToken: "AAAXXX",
      initialRecommendation: {} as model.ChatRecommendationM,
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
    setCurrentPdbAndTimestamp(pdbId: string, timestamp: string) {
      this.pdbId = pdbId;
      this.timestamp = timestamp;
    },
    getTimestamp() {
      return this.timestamp;
    },
    getCurrentPdbId() {
      return this.pdbId;
    },
    setCsrfToken(token: string) {
      this.csrfToken = token;
    },
    getCsrfToken() {
      return this.csrfToken;
    },
    setInitialRecommendation(recommendation: model.ChatRecommendationM) {
      this.initialRecommendation = recommendation;
    },
    getInitialRecommendation(): model.ChatRecommendationM {
      return this.initialRecommendation;
    },
    setCheckPrompt(checkPrompt: boolean){
      this.checkPrompt = checkPrompt;
    },
    getCheckPrompt() {
      return this.checkPrompt;
    },
  },
});
