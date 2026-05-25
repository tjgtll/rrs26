import { create } from 'zustand';

interface SelectedState {
  selected: Set<string>;        
  toggleSelect: (name: string) => void;  
  unselectAll: () => void;              
}

export const useSelectedStore = create<SelectedState>((set) => ({
  selected: new Set<string>(),
  toggleSelect: (name) =>
    set((state) => {
      const newSelected = new Set(state.selected);
      if (newSelected.has(name)) {
        newSelected.delete(name);
      } else {
        newSelected.add(name);
      }
      return { selected: newSelected };
    }),
  unselectAll: () => set({ selected: new Set() }),
}));