import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { persist } from 'zustand/middleware';

export const useConstructionStore = create(
  persist(
    immer((set, get) => ({
      pins: {},
      nextPinId: 1,
      backgroundImage: null,

      addPin: (pinData) => set(state => {
        const newPin = { id: state.nextPinId, ...pinData };
        state.pins[state.nextPinId] = newPin;
        state.nextPinId++;
      }),

      deletePin: (pinId) => set(state => {
        delete state.pins[pinId];
      }),

      getPinById: (pinId) => get().pins[pinId],

      setBackgroundImage: (imageUrl) => set(state => {
        state.backgroundImage = imageUrl;
      }),
    })),
    {
      name: 'ranpro-construction-storage', // שם לאחסון ב-localStorage
    }
  )
);
