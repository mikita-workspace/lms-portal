import { create } from 'zustand';

type ConfettiStore = {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
};

export const useConfettiStore = create<ConfettiStore>((set) => ({
  isOpen: false,
  onClose: () => set({ isOpen: false }),
  onOpen: () => set({ isOpen: true }),
}));
