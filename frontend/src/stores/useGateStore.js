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

     // Listen to backend live logs
      listenLiveLogs: () => {
        // Remove previous listeners to avoid duplicates
        socket.off("newLog");
        socket.off("gateStatusUpdate");

        // Listen for new log events
        socket.on("newLog", (log) => {
          const time = new Date().toLocaleTimeString();

          if (log.gateType === "entrance") {
            const action = log.success ? "opened" : "closed";
            get().setIsEntranceGateOpen(log.success);
            get().set({ lastEntranceAction: { action, time } });

            if (log.success) setTimeout(() => get().setIsEntranceGateOpen(false), 5000);
          }

          if (log.gateType === "exit") {
            const action = log.success ? "opened" : "closed";
            get().setIsExitGateOpen(log.success);
            get().set({ lastExitAction: { action, time } });

            if (log.success) setTimeout(() => get().setIsExitGateOpen(false), 5000);
          }
        });

        // Listen for direct gate status updates from backend
        socket.on("gateStatusUpdate", ({ entranceOpen, exitOpen }) => {
          const time = new Date().toLocaleTimeString();

          get().setIsEntranceGateOpen(entranceOpen);
          get().set({ lastEntranceAction: { action: entranceOpen ? "opened" : "closed", time } });

          get().setIsExitGateOpen(exitOpen);
          get().set({ lastExitAction: { action: exitOpen ? "opened" : "closed", time } });
        });
      }

    }),
    {
      name: "gate-store",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
