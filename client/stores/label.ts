import { fetchy } from "@/utils/fetchy";
import { defineStore } from "pinia";

export const useLabelStore = defineStore(
  "label",
  () => {
    const createLabel = async (label: string) => {
      await fetchy(`/api/labels/${label}`, "POST");
    };

    const deleteLabel = async (label: string) => {
      await fetchy(`/api/labels/${label}`, "DELETE");
    };

    const updateLabel = async (oldLabel: string, newLabel: string) => {
      await fetchy(`/api/labels`, "PATCH", { body: { oldLabel, newLabel } });
    };

    const labelAccount = async (label: string, item: string) => {
      await fetchy(`/api/itemLabels`, "POST", { body: { item, label } });
    };

    const unlabelAccount = async (label: string, username: string) => {
      const item = await fetchy(`/api/users`, "GET", { body: { username } });
      await fetchy(`/api/itemLabels`, "DELETE", { body: { item, label } });
    };

    return { createLabel, deleteLabel, updateLabel, labelAccount, unlabelAccount };
  },
  { persist: true },
);
