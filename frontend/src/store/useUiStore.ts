import { create } from 'zustand';

type UiState = {
  mode: 'light' | 'dark';
  toggleMode: () => void;
  setMode: (m: 'light' | 'dark') => void;
};

const initial = (localStorage.getItem('color-mode') as 'light' | 'dark') || 'light';

export const useUiStore = create<UiState>((set, get) => ({
  mode: initial,
  toggleMode: () => {
    const next = get().mode === 'light' ? 'dark' : 'light';
    localStorage.setItem('color-mode', next);
    set({ mode: next });
  },
  setMode: (m) => {
    localStorage.setItem('color-mode', m);
    set({ mode: m });
  },
}));