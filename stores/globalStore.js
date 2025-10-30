import { defineStore } from "pinia";

export const useGlobalStore = defineStore("globalStore", {
  state: () => ({
    data: "store",
  }),
  getters: {},
  actions: {},
});
