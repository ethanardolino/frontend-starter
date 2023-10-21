import { fetchy } from "@/utils/fetchy";
import { defineStore } from "pinia";

export const useLabelStore = defineStore(
  "label",
  () => {
    const createLabel = async (label: string) => {
      await fetchy(`/api/labels/${label}`, "POST");
    };

    const removeLabel = async (label: string, username: string) => {
      if (username !== "") {
        await fetchy(`/api/itemLabels`, "DELETE", { query: { label, item: username } });
      } else {
        await fetchy(`/api/labels`, "DELETE", { query: { label } });
      }
    };

    const updateLabel = async (oldLabel: string, newLabel: string) => {
      await fetchy(`/api/labels`, "PATCH", { body: { oldLabel, newLabel } });
    };

    const labelAccount = async (label: string, item: string) => {
      await fetchy(`/api/itemLabels`, "POST", { body: { item, label } });
    };

    return { createLabel, removeLabel, updateLabel, labelAccount };
  },
  { persist: true },
);
