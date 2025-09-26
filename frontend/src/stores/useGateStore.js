import { create } from "zustand";
import { persist, createJSONStorage } from 'zustand/middleware'


export const useGateStore = create()(
  persist(
    (set) => ({
      // Initial states
      isEntranceGateOpen: false,
      isExitGateOpen: false,

      // Actions
      setIsEntranceGateOpen: (value) => set({ isEntranceGateOpen: value }),
      setIsExitGateOpen: (value) => set({ isExitGateOpen: value }),
    }),
    {
      name: "gate-store", // key in localStorage
      storage: createJSONStorage(() => localStorage),
    }
  )
);