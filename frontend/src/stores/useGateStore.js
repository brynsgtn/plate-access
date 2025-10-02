import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// Create a broadcast channel for cross-tab communication
const channel = typeof window !== 'undefined' ? new BroadcastChannel('gate-updates') : null;

export const useGateStore = create()(
  persist(
    (set, get) => ({
      // Initial states
      isEntranceGateOpen: false,
      isExitGateOpen: false,
      lastEntranceAction: null,
      lastExitAction: null,

      // Initialize cross-tab listener
      initCrossTabSync: () => {
        if (channel) {
          channel.onmessage = (event) => {
            const { type, data } = event.data;
            
            if (type === 'ENTRANCE_GATE_UPDATE') {
              set({
                isEntranceGateOpen: data.isOpen,
                lastEntranceAction: data.lastAction,
              }, false); // Don't trigger persistence
            } else if (type === 'EXIT_GATE_UPDATE') {
              set({
                isExitGateOpen: data.isOpen,
                lastExitAction: data.lastAction,
              }, false);
            }
          };
        }
      },

      // Actions
      setIsEntranceGateOpen: (value) => {
        const newState = {
          isEntranceGateOpen: value,
          lastEntranceAction: {
            action: value ? "opened" : "closed",
            time: new Date().toLocaleTimeString(),
          },
        };
        
        set(newState);
        
        // Broadcast to other tabs
        if (channel) {
          channel.postMessage({
            type: 'ENTRANCE_GATE_UPDATE',
            data: {
              isOpen: value,
              lastAction: newState.lastEntranceAction,
            },
          });
        }
      },

      setIsExitGateOpen: (value) => {
        const newState = {
          isExitGateOpen: value,
          lastExitAction: {
            action: value ? "opened" : "closed",
            time: new Date().toLocaleTimeString(),
          },
        };
        
        set(newState);
        
        // Broadcast to other tabs
        if (channel) {
          channel.postMessage({
            type: 'EXIT_GATE_UPDATE',
            data: {
              isOpen: value,
              lastAction: newState.lastExitAction,
            },
          });
        }
      },
    }),
    {
      name: "gate-store",
      storage: createJSONStorage(() => localStorage),
    }
  )
);