import { create } from 'zustand';

type Video = { id: string; duration: number };

type VideoStore = {
  video: Video[];
  setVideo: (video: Video) => void;
};

export const useVideoStore = create<VideoStore>((set) => ({
  video: [],
  setVideo: (video) => set((state) => ({ video: [...state.video, video] })),
}));
