import { create } from 'zustand';

interface TweetModalStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const useTweetModal = create<TweetModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));

export default useTweetModal;
