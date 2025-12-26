import { create } from 'zustand';

interface AppState {
  // 状態（変数）
  is3DMode: boolean;
  isProfileOpen: boolean;
  
  // アクション（関数）
  toggleMode: () => void;
  setProfileOpen: (isOpen: boolean) => void;
}

export const useStore = create<AppState>((set) => ({
  // 初期値
  is3DMode: false,
  isProfileOpen: false,

  // 関数の実体
  toggleMode: () => set((state) => ({ is3DMode: !state.is3DMode })),
  setProfileOpen: (isOpen) => set({ isProfileOpen: isOpen }),
}));