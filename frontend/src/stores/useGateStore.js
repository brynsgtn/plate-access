import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export const useGateStore = create()(
  persist(
    (set) => ({
      // Initial states
      isEntranceGateOpen: false,
      isExitGateOpen: false,
      lastEntranceAction: null, // { action: "open" | "close", time: "12:30 PM" }
      lastExitAction: null,     // { action: "open" | "close", time: "12:30 PM" }

      // Actions
      setIsEntranceGateOpen: (value) =>
        set({
          isEntranceGateOpen: value,
          lastEntranceAction: {
            action: value ? "opened" : "closed",
            time: new Date().toLocaleTimeString(),
          },
        }),

      setIsExitGateOpen: (value) =>
        set({
          isExitGateOpen: value,
          lastExitAction: {
            action: value ? "opened" : "closed",
            time: new Date().toLocaleTimeString(),
          },
        }),
    }),
    {
      name: "gate-store", // key in localStorage
      storage: createJSONStorage(() => localStorage),
    }
  )
);
