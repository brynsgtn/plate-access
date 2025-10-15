import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { io as clientIO } from "socket.io-client";

const channel = typeof window !== 'undefined' ? new BroadcastChannel('gate-updates') : null;
const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5001" : window.location.origin;

const socket = clientIO(BASE_URL, {
  transports: ["websocket", "polling"]
});

export const useGateStore = create()(
  persist(
    (set, get) => ({
      isEntranceGateOpen: false,
      isExitGateOpen: false,
      lastEntranceAction: null,
      lastExitAction: null,

      initCrossTabSync: () => {
        if (channel) {
          channel.onmessage = (event) => {
            const { type, data } = event.data;
            if (type === 'ENTRANCE_GATE_UPDATE') {
              set({
                isEntranceGateOpen: data.isOpen,
                lastEntranceAction: data.lastAction,
              }, false);
            } else if (type === 'EXIT_GATE_UPDATE') {
              set({
                isExitGateOpen: data.isOpen,
                lastExitAction: data.lastAction,
              }, false);
            }
          };
        }
      },

      setIsEntranceGateOpen: (value) => {
        const newState = {
          isEntranceGateOpen: value,
          lastEntranceAction: {
            action: value ? "opened" : "closed",
            time: new Date().toLocaleTimeString(),
          },
        };
        set(newState);
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

      // NEW: Listen to backend live logs
      listenLiveLogs: () => {
        socket.off("newLog");
        socket.on("newLog", (log) => {
          if (log.gateType === "entrance") {
            if (log.success) get().setIsEntranceGateOpen(true);
            else get().setIsEntranceGateOpen(false);

            // Auto-close after 5 seconds if it was opened
            if (log.success) setTimeout(() => get().setIsEntranceGateOpen(false), 5000);
          }

          if (log.gateType === "exit") {
            if (log.success) get().setIsExitGateOpen(true);
            else get().setIsExitGateOpen(false);

            if (log.success) setTimeout(() => get().setIsExitGateOpen(false), 5000);
          }
        });
      },
    }),
    {
      name: "gate-store",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
